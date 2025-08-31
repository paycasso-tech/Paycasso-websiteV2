import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { circleContractSdk } from "@/lib/utils/smart-contract-platform-client";
import { circleDeveloperSdk } from "@/lib/utils/developer-controlled-wallets-client";
import { createAgreementService } from "@/services/agreement.service";
import { convertUSDCToContractAmount, parseAmount } from "@/lib/utils/amount";

interface DepositRequest {
  circleContractId: string
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const agreementService = createAgreementService(supabase);
    const body: DepositRequest = await req.json();

    if (!body.circleContractId) {
      return NextResponse.json(
        { error: "Missing required circleContractId" },
        { status: 400 }
      );
    }

    // Gets the escrow agreement circle_contract_id
    // This will be used to get more information about the agreement using Circle's SDK
    const { data: contractTransaction, error: contractTransactionError } = await supabase
      .from("escrow_agreements")
      .select()
      .eq("circle_contract_id", body.circleContractId)
      .single();

    if (contractTransactionError) {
      console.error("Could not find a contract with such depositor wallet ID", contractTransactionError);
      return NextResponse.json({ error: "Could not find a contract with such depositor wallet ID" });
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User is not authenticated");
      return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
    }

    // Gets the currently logged in user id from their auth_user_id
    // This will be used to get the user circle_wallet_id
    const { data: userId, error: userIdError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user?.id)
      .single();

    if (userIdError) {
      console.error("Could not retrieve the currently logged in user id:", userIdError);
      return NextResponse.json({ error: "Could not retrieve the currently logged in user id" }, { status: 500 })
    }

    // Gets the currently logged in user circle_wallet_id based on their user id
    // This will be used to get the escrow agreement circle_contract_id
    const { data: depositorWallet, error: depositorWalletError } = await supabase
      .from("wallets")
      .select()
      .eq("profile_id", userId.id)
      .single();

    if (depositorWalletError) {
      console.error("Could not find a profile linked to the given wallet ID", depositorWalletError);
      return NextResponse.json({ error: "Could not find a profile linked to the given wallet ID" }, { status: 500 });
    }

    // Retrieves contract data from Circle's SDK
    const contractData = await circleContractSdk.getContract({
      id: contractTransaction.circle_contract_id
    });

    if (!contractData.data) {
      console.error("Could not retrieve contract data");
      return NextResponse.json({ error: "Could not retrieve contract data" }, { status: 500 });
    }

    const contractAddress = contractData.data?.contract.contractAddress;

    if (!contractAddress) {
      return NextResponse.json({ error: "Could not retrieve contract address" }, { status: 500 })
    }

    const parsedAmount = parseAmount(contractTransaction.terms.amounts?.[0].amount);
    const contractAmount = Number(convertUSDCToContractAmount(parsedAmount))

    const circleApprovalResponse = await circleDeveloperSdk.createContractExecutionTransaction({
      abiFunctionSignature: "approve(address,uint256)",
      abiParameters: [contractAddress, contractAmount],
      contractAddress: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as string,
      fee: {
        type: "level",
        config: {
          feeLevel: "HIGH",
        }
      },
      walletId: depositorWallet.circle_wallet_id
    });

    await agreementService.createTransaction({
      walletId: depositorWallet.id,
      circleTransactionId: circleApprovalResponse.data?.id,
      escrowAgreementId: contractTransaction.id,
      transactionType: "DEPOSIT_APPROVAL",
      profileId: depositorWallet.profile_id,
      amount: Number(parsedAmount),
      description: "Request for deposit approval",
    });

    console.log("Deposit approval transaction created:", circleApprovalResponse.data);

    await supabase
      .from("escrow_agreements")
      .update({ status: "PENDING" })
      .eq("circle_contract_id", contractData.data.contract.id);

    return NextResponse.json(
      {
        success: true,
        transactionId: circleApprovalResponse.data?.id,
        status: circleApprovalResponse.data?.state,
        message: "Funds deposit approval initiated"
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error during deposit approval:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate deposit approval",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

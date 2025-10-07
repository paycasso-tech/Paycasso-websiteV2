// // app/api/wallet/balance/route.ts
// import { type NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/db";
// import { UserModel } from "@/models/User.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { Coinbase, ExternalAddress } from "@coinbase/coinbase-sdk";

// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();
//     const user = await UserModel.findOne({ userId });

//     if (!user || !user.wallet?.address) {
//       return NextResponse.json({ error: "User or wallet not found" }, { status: 404 });
//     }

//     const address = new ExternalAddress(
//       process.env.APP_ENV === "production"
//         ? Coinbase.networks.BaseMainnet
//         : Coinbase.networks.BaseSepolia,
//       user.wallet.address as string
//     );
//     const usdcBalance = (await address.getBalance(Coinbase.assets.Usdc)).toNumber();

//     return NextResponse.json({ balance: usdcBalance.toString() });
//   } catch (error) {
//     console.error("Error fetching balance from wallet:", error);
//     if (error instanceof Error && error.message.includes("not found")) {
//       return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
//     }
//     return NextResponse.json(
//       { error: "Internal server error while fetching balance" },
//       { status: 500 },
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { circleDeveloperSdk } from "@/lib/utils/developer-controlled-wallets-client";
import { z } from "zod";

const WalletIdSchema = z.object({
  walletId: z.string().uuid(),
});

const ResponseSchema = z.object({
  balance: z.string().optional(),
  error: z.string().optional(),
});

type WalletBalanceResponse = z.infer<typeof ResponseSchema>;

export async function POST(
  req: NextRequest
): Promise<NextResponse<WalletBalanceResponse>> {
  try {
    const body = await req.json();
    const parseResult = WalletIdSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid walletId format" },
        { status: 400 }
      );
    }

    const { walletId } = parseResult.data;

    const response = await circleDeveloperSdk.getWalletTokenBalance({
      id: walletId,
      includeAll: true,
    });

    const balance = response.data?.tokenBalances?.find(
      ({ token }) => token.symbol === "USDC"
    )?.amount;

    return NextResponse.json({ balance: balance || "0" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    console.error("Error fetching balance from wallet:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error while fetching balance" },
      { status: 500 }
    );
  }
}
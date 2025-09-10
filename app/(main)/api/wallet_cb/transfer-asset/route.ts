/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import path from 'path';
import AppError from "@/utils/appError"; // Changed to default import

// Update the interface to match the controller
interface AssetTransferRequest {
  body: {
    asset: string;
    data: {
      recipient: string;
      amount: number;
    };
  };
  auth: {
    userId: string;
  };
}

const apiKeyPath = path.join(process.cwd(), 'src/lib/coinbase.service/cdp_api_key.json');
const cb = Coinbase.configureFromJson({
  filePath: apiKeyPath,
  useServerSigner: true
});

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const auth = getAuth(req);
    if (!auth.userId) {
      throw new AppError(401, "error", "Unauthorized");
    }

    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await req.json();
    const { asset, data } = body;
    const { recipient, amount } = data;

    // Create a request object that matches the expected interface
    const assetTransferRequest: AssetTransferRequest = {
      body: { asset, data },
      auth
    };

    // Use the controller logic
    return await transferAsset(assetTransferRequest, NextResponse, () => {});
  } catch (error) {
    console.error("[api/wallet/transfer-asset] Transfer Failed:", error);
    
    // Handle AppError specifically
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    // Generic error handling
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// The controller function adapted for Next.js API route
async function transferAsset(req: AssetTransferRequest, res: any, next: Function) {
  try {
    const { asset, data } = req.body;
    const { recipient, amount } = data;
    
    let user = await UserModel.findOne({ userId: req.auth.userId });
    let destination = await UserModel.findOne({ email: recipient });

    
    if (!user)
      throw new AppError(404, "error", "User not found");
    if (!user.wallet?.id)
      throw new AppError(404, "error", "Wallet not found");
    if (!asset || !data || !recipient || !amount)
      throw new AppError(400, "error", "Invalid request");
    
    const wallet = await Wallet.fetch(user.wallet?.id);

    console.log(wallet);
    
    if (asset == Coinbase.assets.Usdc) {
      const balance = await wallet.getBalance(asset);
      if (balance.lessThan(amount))
        throw new AppError(400, "error", "Insufficient balance");
    }
    else {
      throw new AppError(400, "error", "Unsupported asset");
    }
    
    const transfer = await (await wallet.createTransfer({
      amount: amount,
      assetId: asset,
      destination: destination && destination.wallet?.address
        ? destination.wallet?.address
        : recipient,
      gasless: asset == Coinbase.assets.Usdc ? true : false,
    })).wait({ timeoutSeconds: 30 }); 

    console.log("Transfer initiated:", transfer);

    try {
      const transferResult = await transfer.wait({ timeoutSeconds: 30 });
      console.log("Transfer completed:", transferResult);

      return NextResponse.json({
        transactionLink: transferResult.getTransactionLink(),
        status: transferResult.getStatus()
      });
    } catch (error) {
      console.error("Transfer failed:", error);
      throw new AppError(500, "error", "Transfer process timed out");
    }
  } catch (error) {
    console.error("[controllers/wallet/transferAsset] Transfer Failed: ", error);
    throw error; // Propagate error to the main handler
  }
}

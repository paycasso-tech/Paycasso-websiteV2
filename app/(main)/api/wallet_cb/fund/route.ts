// app/api/wallet/fund/route.ts
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { Coinbase } from "@coinbase/coinbase-sdk";
import { coinbase } from "@/lib/coinbase.service";
import { faucetConfig } from "@/lib/faucet";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { asset, amount } = await req.json();

    if (!amount || !asset || amount > faucetConfig.MAX_REQUEST_AMOUNT) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let user = await UserModel.findOne({ userId });

    if (!user || !user.wallet?.id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if ((user.faucet.amount + amount) > faucetConfig.MAX_TOTAL_AMOUNT) {
      return NextResponse.json({ error: "Limit exceeded" }, { status: 400 });
    }

    if ((user.wallet.usdBalance - amount) <= 0) {
      return NextResponse.json({ error: "Insufficient USD" }, { status: 400 });
    }

    if (user.faucet.lastRequested) {
      const now = new Date();
      const timeSinceLastRequest = (now.getTime() - user.faucet.lastRequested?.getTime()) / 1000;
      if (timeSinceLastRequest < faucetConfig.MIN_REQUEST_INTERVAL) {
        return NextResponse.json({ error: "Too many requests" }, { status: 400 });
      }
    }

    if (!Object.values(Coinbase.assets).includes(asset)) {
      return NextResponse.json({ error: "Asset not supported" }, { status: 400 });
    }

    await coinbase.fundWallet(user.wallet.address as string, asset, amount);

    user.wallet.usdBalance -= amount;
    user.faucet.amount += amount;
    user.faucet.lastRequested = new Date();
    await user.save();

    return NextResponse.json(user);
  } catch (error) {
    console.error("[api/wallet/fund] Funding Failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

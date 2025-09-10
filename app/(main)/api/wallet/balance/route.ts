// app/api/wallet/balance/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { getAuth } from "@clerk/nextjs/server";
import { Coinbase, ExternalAddress } from "@coinbase/coinbase-sdk";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await UserModel.findOne({ userId });

    if (!user || !user.wallet?.address) {
      return NextResponse.json({ error: "User or wallet not found" }, { status: 404 });
    }

    const address = new ExternalAddress(
      process.env.APP_ENV === "production"
        ? Coinbase.networks.BaseMainnet
        : Coinbase.networks.BaseSepolia,
      user.wallet.address as string
    );
    const usdcBalance = (await address.getBalance(Coinbase.assets.Usdc)).toNumber();

    return NextResponse.json({ balance: usdcBalance.toString() });
  } catch (error) {
    console.error("Error fetching balance from wallet:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error while fetching balance" },
      { status: 500 },
    );
  }
}
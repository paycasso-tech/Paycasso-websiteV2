/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User.model";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Coinbase, ExternalAddress } from "@coinbase/coinbase-sdk";
import { cb as coinbase, createWalletForUser, fundWallet } from "@/lib/coinbase.service/coinbase.services";
import { faucetConfig } from "@/lib/faucet";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    let dbUser = await UserModel.findOne({ userId: user.id });
    
    // If user doesn't exist, create user
    if (!dbUser) {
      const userName = (!user.firstName && !user.lastName)
        ? user.primaryEmailAddress?.emailAddress?.split('@')[0]
        : (user.firstName || "") + (user.lastName ? " " + user.lastName : "");

      dbUser = await new UserModel({
        userId: user.id,
        name: userName,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
        wallet: { rewards: {} },
        faucet: {}
      }).save();
    }

    // If wallet doesn't exist, create wallet
    if (!dbUser.wallet?.id) {
      try {
        dbUser = await createWalletForUser(dbUser);
        const address = dbUser?.wallet?.address as string;

        // Fund the wallet
        try {
          await fundWallet(address, Coinbase.assets.Usdc, faucetConfig.INITIAL_AMOUNT);
        } catch (err) {
          console.error(`[api/wallet/user] Failed to fund wallet | User: ${dbUser?.userId}`);
          console.error(err);
        }
      } catch (err) {
        console.error(`[api/wallet/user] Failed to create wallet | User: ${dbUser?.userId}`);
        console.error(err);
      }
    }

    // If wallet exists, fetch wallet balance & calculate reward
    if (dbUser.wallet?.address) {
      try {
        const address = new ExternalAddress(
          process.env.APP_ENV === "production"
            ? Coinbase.networks.BaseMainnet
            : Coinbase.networks.BaseSepolia,
          dbUser.wallet.address as string
        );
        const usdcBalance = (await address.getBalance(Coinbase.assets.Usdc)).toNumber();

        // Calculate and update rewards
        const apyRate = 3; // 3% APY
        const currentDate = new Date();
        const lastUpdated = dbUser.wallet.rewards?.lastUpdated || new Date();
        const timeDifference = currentDate.getTime() - new Date(lastUpdated).getTime();
        const daysSinceLastUpdate = timeDifference / (1000 * 60 * 60 * 24);
        const rewardEarned = (usdcBalance * apyRate * daysSinceLastUpdate) / (100 * 365);

        if (dbUser.wallet.rewards) {
          dbUser.wallet.rewards.amount += rewardEarned;
          dbUser.wallet.rewards.lastUpdated = currentDate;
        }

        dbUser = await dbUser.save();

        // Create response with updated balance
        const response = {
          ...dbUser.toJSON(),
          wallet: {
            ...dbUser.wallet,
            usdcBalance: usdcBalance
          }
        };

        return NextResponse.json(response);
      } catch (err) {
        console.error(`[api/wallet/user] Failed to fetch balance | User: ${dbUser?.userId}`);
        console.error(err);
      }
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("[api/wallet/user] Failed to get user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
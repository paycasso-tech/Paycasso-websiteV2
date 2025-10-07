// // app/api/wallet/route.ts
// import { connectToDatabase } from "@/lib/db";
// import { UserModel } from "@/models/User.model";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { Coinbase } from "@coinbase/coinbase-sdk";
// import { createWalletForUser, fundWallet } from "@/lib/coinbase.service/coinbase.services";
// import { faucetConfig } from "@/lib/faucet";

// export async function POST(req: Request) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();

//     let dbUser = await UserModel.findOne({ userId: user.id });

//     // If user doesn't exist, create user
//     if (!dbUser) {
//       const userName = (!user.firstName && !user.lastName)
//         ? user.primaryEmailAddress?.emailAddress?.split('@')[0]
//         : (user.firstName || "") + (user.lastName ? " " + user.lastName : "");

//       dbUser = await new UserModel({
//         userId: user.id,
//         name: userName,
//         email: user.primaryEmailAddress?.emailAddress,
//         imageUrl: user.imageUrl,
//         wallet: { rewards: {} },
//         faucet: {}
//       }).save();
//     }

//     // If wallet doesn't exist, create wallet
//     if (!dbUser.wallet?.id) {
//       try {
//         dbUser = await createWalletForUser(dbUser);
//         const address = dbUser?.wallet?.address as string;

//         // Fund the wallet
//         try {
//           await fundWallet(address, Coinbase.assets.Usdc, faucetConfig.INITIAL_AMOUNT);
//         } catch (err) {
//           console.error(`[api/wallet] Failed to fund wallet | User: ${dbUser?.userId}`);
//           console.error(err);
//         }
//       } catch (err) {
//         console.error(`[api/wallet] Failed to create wallet | User: ${dbUser?.userId}`);
//         console.error(err);
//       }
//     }

//     return NextResponse.json(dbUser, { status: 201 });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json(
//       { error: `Failed to create wallet: ${message}` },
//       { status: 500 }
//     );
//   }
// }

import type { Blockchain } from "@circle-fin/smart-contract-platform";
import { NextRequest, NextResponse } from "next/server";
import { circleDeveloperSdk } from "@/lib/utils/developer-controlled-wallets-client";

export async function POST(req: NextRequest) {
  try {
    const { walletSetId } = await req.json();

    if (!walletSetId) {
      return NextResponse.json(
        { error: "walletSetId is required" },
        { status: 400 }
      );
    }

    if (!process.env.CIRCLE_BLOCKCHAIN) {
      throw new Error("CIRCLE_BLOCKCHAIN environment variable is not set");
    }

    const response = await circleDeveloperSdk.createWallets({
      accountType: "SCA",
      blockchains: [process.env.CIRCLE_BLOCKCHAIN as Blockchain],
      count: 1,
      walletSetId,
    });

    if (!response.data?.wallets?.length) {
      return NextResponse.json(
        { error: "No wallets were created" },
        { status: 500 }
      );
    }

    const [createdWallet] = response.data.wallets;

    return NextResponse.json(createdWallet, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create wallet: ${message}` },
      { status: 500 }
    );
  }
}
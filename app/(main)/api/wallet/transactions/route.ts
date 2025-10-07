// // app/api/wallet/transactions/route.ts
// import { Wallet, Coinbase, Transfer, PaginationResponse } from "@coinbase/coinbase-sdk";
// import { connectToDatabase } from "@/lib/db";
// import { UserModel, UserDocument } from "@/models/User.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// interface TransferData {
//     id: string;
//     destinationAddress: string;
//     destinationUser: any | null;
//     transactionLink: string | null;
//     status: string | null;
//     amount: number;
// }

// export async function GET(req: NextRequest): Promise<NextResponse> {
//     try {
//         const { userId } = getAuth(req);
//         if (!userId) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         await connectToDatabase();

//         const user = await UserModel.findOne({ userId });
//         if (!user || !user.wallet?.id) {
//             return NextResponse.json({ error: "User or wallet not found" }, { status: 404 });
//         }

//         const wallet = await Wallet.fetch(user.wallet.id);
//         const address = await wallet.getDefaultAddress();
//         const transfersResponse: PaginationResponse<Transfer> = await address.listTransfers();

//         const processedTransfers: TransferData[] = [];
//         const addressUserMap = new Map<string, UserDocument | null>();
//         const items = transfersResponse.data;

//         for (const transfer of items) {
//             const destinationAddress = transfer.getDestinationAddressId();
//             let destinationUser: any | null = null;

//             if (addressUserMap.has(destinationAddress)) {
//                 destinationUser = addressUserMap.get(destinationAddress) ?? null;
//             } else {
//                 const foundUser = await UserModel.findOne({
//                     'wallet.address': { $regex: new RegExp(destinationAddress, 'i') }
//                 });

//                 if (foundUser) {
//                     destinationUser = { name: foundUser.name, email: foundUser.email };
//                 }
//                 addressUserMap.set(destinationAddress, destinationUser);
//             }

//             processedTransfers.push({
//                 id: transfer.getId(),
//                 destinationAddress: transfer.getDestinationAddressId(),
//                 destinationUser: destinationUser,
//                 transactionLink: transfer.getTransactionLink() || null,
//                 status: transfer.getStatus() || null,
//                 amount: Number(transfer.getAmount())
//             });
//         }

//         return NextResponse.json({ transactions: processedTransfers.reverse() });

//     } catch (error) {
//         console.error("[api/wallet/transfers] Failed to get transfers:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

import { type NextRequest, NextResponse } from "next/server";
import { circleDeveloperSdk } from "@/lib/utils/developer-controlled-wallets-client";
import { z } from "zod";

const WalletIdSchema = z.object({
  walletId: z.string().uuid(),
});

const ResponseSchema = z.object({
  transactions: z
    .array(
      z.object({
        id: z.string(),
        amount: z.array(z.string()),
        status: z.string(),
        transactionType: z.string(),
        createDate: z.string(),
        circleContractAddress: z.string().optional(),
      })
    )
    .optional(),
  error: z.string().optional(),
});

export type WalletTransactionsResponse = z.infer<typeof ResponseSchema>;

if (!process.env.CIRCLE_API_KEY || !process.env.CIRCLE_ENTITY_SECRET) {
  throw new Error(
    "Missing required environment variables: CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET must be defined"
  );
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<WalletTransactionsResponse>> {
  try {
    // Add better error handling for request body parsing
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Check if body exists and has required field
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a valid JSON object" },
        { status: 400 }
      );
    }

    if (!body.walletId) {
      return NextResponse.json(
        { error: "walletId is required" },
        { status: 400 }
      );
    }

    if (typeof body.walletId !== "string") {
      return NextResponse.json(
        { error: "walletId must be a string" },
        { status: 400 }
      );
    }

    const parseResult = WalletIdSchema.safeParse(body);
    console.log("Zod validation result:", parseResult);

    if (!parseResult.success) {
      console.error("Zod validation errors:", parseResult.error.issues);

      // Provide more specific error messages
      const errorMessages = parseResult.error.issues.map((err) => {
        if (err.path.includes("walletId")) {
          if (
            err.code === "invalid_format" &&
            'validation' in err &&
            typeof err.validation === "string" &&
            err.validation === "uuid"
          ) {
            return "walletId must be a valid UUID format";
          }
          return `walletId: ${err.message}`;
        }
        return err.message;
      });

      return NextResponse.json(
        { error: `Validation failed: ${errorMessages.join(", ")}` },
        { status: 400 }
      );
    }

    const { walletId } = parseResult.data;

    const response = await circleDeveloperSdk.listTransactions({
      walletIds: [walletId],
      includeAll: true,
    });

    if (
      !response.data?.transactions ||
      response.data.transactions.length === 0
    ) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      transactions: response.data.transactions.map((tx) => ({
        id: tx.id,
        amount: tx.amounts || [],
        status: tx.state,
        transactionType: tx.transactionType,
        createDate: tx.createDate,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    console.error("Error fetching transactions from wallet:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error while fetching transactions" },
      { status: 500 }
    );
  }
}
// app/api/wallet/transactions/route.ts
import { Wallet, Coinbase, Transfer, PaginationResponse } from "@coinbase/coinbase-sdk";
import { connectToDatabase } from "@/lib/db";
import { UserModel, UserDocument } from "@/models/User.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

interface TransferData {
    id: string;
    destinationAddress: string;
    destinationUser: any | null;
    transactionLink: string | null;
    status: string | null;
    amount: number;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const user = await UserModel.findOne({ userId });
        if (!user || !user.wallet?.id) {
            return NextResponse.json({ error: "User or wallet not found" }, { status: 404 });
        }

        const wallet = await Wallet.fetch(user.wallet.id);
        const address = await wallet.getDefaultAddress();
        const transfersResponse: PaginationResponse<Transfer> = await address.listTransfers();

        const processedTransfers: TransferData[] = [];
        const addressUserMap = new Map<string, UserDocument | null>();
        const items = transfersResponse.data;

        for (const transfer of items) {
            const destinationAddress = transfer.getDestinationAddressId();
            let destinationUser: any | null = null;

            if (addressUserMap.has(destinationAddress)) {
                destinationUser = addressUserMap.get(destinationAddress) ?? null;
            } else {
                const foundUser = await UserModel.findOne({
                    'wallet.address': { $regex: new RegExp(destinationAddress, 'i') }
                });

                if (foundUser) {
                    destinationUser = { name: foundUser.name, email: foundUser.email };
                }
                addressUserMap.set(destinationAddress, destinationUser);
            }

            processedTransfers.push({
                id: transfer.getId(),
                destinationAddress: transfer.getDestinationAddressId(),
                destinationUser: destinationUser,
                transactionLink: transfer.getTransactionLink() || null,
                status: transfer.getStatus() || null,
                amount: Number(transfer.getAmount())
            });
        }

        return NextResponse.json({ transactions: processedTransfers.reverse() });

    } catch (error) {
        console.error("[api/wallet/transfers] Failed to get transfers:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
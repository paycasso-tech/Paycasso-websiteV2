/* eslint-disable @typescript-eslint/no-unused-vars */
import { Wallet, Coinbase, Transfer, PaginationResponse } from "@coinbase/coinbase-sdk";
import { connectToDatabase } from "@/lib/db";
import { UserModel, UserDocument } from "@/models/User.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import path from 'path';

interface TransferData {
    id: string;
    destinationAddress: string;
    destinationUser: {
        wallet: {
            rewards: {
                amount: number;
                lastUpdated: string;
                _id: string;
                usdBalance: number;
                address: string;
            };
            _id: string;
            userId: string;
            name: string;
            email: string;
            imageUrl: string;
            faucet: {
                amount: number;
                _id: string;
                __v: number;
                assetId: string;
            };
        };
    } | null;
    transactionLink: string | null;
    status: string | null; 
    amount: number; 
}


const apiKeyPath = path.join(process.cwd(), 'src/lib/coinbase.service/cdp_api_key.json');
const cb = Coinbase.configureFromJson({
    filePath: apiKeyPath,
    useServerSigner: true
});

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();

        const user = await UserModel.findOne({ userId });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (!user.wallet?.id) {
            return NextResponse.json(
                { error: "Wallet not found" },
                { status: 404 }
            );
        }

        const wallet = await Wallet.fetch(user.wallet.id);
        const address = await wallet.getDefaultAddress();
        const transfersResponse: PaginationResponse<Transfer> = await address.listTransfers();

        const processedTransfers: TransferData[] = [];
        const addressUserMap = new Map<string, UserDocument | null>();
        // Handle paginated response
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
                    destinationUser = {
                        wallet: {
                            rewards: {
                                amount: 0.00004089340753424658, // Replace with actual value if available from transfer
                                lastUpdated: "2025-02-24T23:15:36.464Z", // Replace with actual value
                                _id: "67bcec88e5988201ccae4095", // Replace
                                usdBalance: 1200, // Replace
                                address: destinationAddress
                            },
                            _id: "someId", // Replace with actual value
                            userId: "someUserId", // Replace
                            name: foundUser.name,
                            email: foundUser.email,
                            imageUrl: "https://img.clerk.com/...", // Replace if applicable
                            faucet: {
                                amount: 0,
                                _id: "someFaucetId", // Replace
                                __v: 0,
                                assetId: "usdc"
                            }
                        }
                    };
                }

                addressUserMap.set(destinationAddress, destinationUser);
            }

            processedTransfers.push({
                id: transfer.getId(),
                destinationAddress: transfer.getDestinationAddressId(),
                destinationUser: destinationUser,
                transactionLink: transfer.getTransactionLink() || null, // Handle potentially undefined values
                status: transfer.getStatus() || null, // Handle potentially undefined values
                amount: Number(transfer.getAmount()) // Convert Decimal to number
            });
        }

        return NextResponse.json(processedTransfers.reverse());

    } catch (error) {
        console.error("[api/wallet/transfers] Failed to get transfers:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { query } from "@/lib/db/postgres";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user's profile
    const profiles = await query<{ id: number }>(
      "SELECT id FROM profiles WHERE user_id = $1",
      [session.user.id]
    );

    if (profiles.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get user's wallet
    const wallets = await query<{
      id: number;
      circle_wallet_id: string;
      wallet_address: string;
      wallet_type: string;
      blockchain: string;
      currency: string;
    }>(
      "SELECT id, circle_wallet_id, wallet_address, wallet_type, blockchain, currency FROM wallets WHERE profile_id = $1 LIMIT 1",
      [profiles[0].id]
    );

    if (wallets.length === 0) {
      return NextResponse.json({ error: "No wallet found" }, { status: 404 });
    }

    return NextResponse.json({ wallet: wallets[0] });
  } catch (error: any) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

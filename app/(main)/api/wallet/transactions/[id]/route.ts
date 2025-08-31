import { type NextRequest, NextResponse } from "next/server";
import { circleDeveloperSdk } from "@/lib/utils/developer-controlled-wallets-client";
import { z } from "zod";

// ✅ Zod schema for Circle API response
const ResponseSchema = z.object({
  transaction: z
    .object({
      id: z.string(),
      amounts: z.array(z.string()).optional(),
      state: z.string(),
      createDate: z.string(),
      blockchain: z.string(),
      transactionType: z.string(),
      updateDate: z.string(),
    })
    .optional(),
  error: z.string().optional(),
});

type TransactionResponse = z.infer<typeof ResponseSchema>;

// ✅ Required env check
if (!process.env.CIRCLE_API_KEY || !process.env.CIRCLE_ENTITY_SECRET) {
  throw new Error(
    "Missing required environment variables: CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET must be defined",
  );
}

// ✅ Route handler
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<TransactionResponse>> {
  try {
    // ✅ Await the params Promise
    const { id } = await context.params;

    // ✅ Validate the transaction ID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 },
      );
    }

    // ✅ Call Circle API
    const response = await circleDeveloperSdk.getTransaction({ id });

    // ✅ Validate with Zod
    const parseResult = ResponseSchema.safeParse({
      transaction: response.data?.transaction,
    });

    if (!parseResult.success) {
      console.error("Response validation failed:", parseResult.error);
      return NextResponse.json(
        { error: "Invalid response from Circle API" },
        { status: 500 },
      );
    }

    if (!response.data || response.data.transaction === undefined) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    // ✅ Build transaction object
    const transaction = {
      id: response.data.transaction.id,
      amounts: response.data.transaction.amounts,
      state: response.data.transaction.state,
      createDate: response.data.transaction.createDate,
      blockchain: response.data.transaction.blockchain,
      transactionType: response.data.transaction.transactionType,
      updateDate: response.data.transaction.updateDate,
    };

    return NextResponse.json({ transaction });
  } catch (error) {
    console.error("Error fetching transaction:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error while fetching transaction" },
      { status: 500 },
    );
  }
}
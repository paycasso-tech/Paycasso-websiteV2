import "dotenv/config";
import { CdpClient } from "@coinbase/cdp-sdk";

async function testCDPConnection() {
  try {
    console.log("🔄 Testing CDP Connection...\n");

    const apiKeyId = process.env.CDP_API_KEY_ID; // note: docs say “ID”, not “NAME”
    const apiKeySecret = process.env.CDP_API_KEY_SECRET;
    const walletSecret = process.env.CDP_WALLET_SECRET; // docs mention this too

    if (!apiKeyId || !apiKeySecret || !walletSecret) {
      throw new Error("CDP credentials not found in .env file");
    }

    console.log("✅ Environment variables loaded");
    console.log(`📝 API Key ID: ${apiKeyId.substring(0, 30)}...`);

    const cdp = new CdpClient({
      apiKeyId: apiKeyId,
      apiKeySecret: apiKeySecret,
      walletSecret: walletSecret,
    });

    console.log("✅ CDP Client configured successfully!\n");

    console.log("🔍 Fetching some data...");
    // example: list balances (from docs)
    const result = await cdp.evm.listTokenBalances({
      address: "0x...", // supply a valid address
      network: "base-sepolia", // or whichever network you are using
    });
    console.log(result);

    console.log("\n✅ CONNECTION TEST PASSED!\n");
    console.log("🎉 Ready to proceed!\n");
  } catch (error) {
    console.error("❌ CONNECTION TEST FAILED:");
    console.error(error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error(
      "1. Check your .env file has CDP_API_KEY_ID, CDP_API_KEY_SECRET, CDP_WALLET_SECRET"
    );
    console.error(
      "2. Verify the private key / wallet secret format includes newlines and is exact"
    );
    console.error("3. Make sure you copied full key from CDP Portal\n");
  }
}

testCDPConnection();

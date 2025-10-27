"use server";

import { encodedRedirect } from "@/lib/utils/utils";
import { query } from "@/lib/db/postgres";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const companyName = formData.get("company-name")?.toString()?.trim();
  const fullName = formData.get("full-name")?.toString()?.trim();

  // Validation
  if (fullName && (fullName.length < 3 || fullName.length > 255)) {
    return { error: "Full name must be between 3 and 255 characters" };
  }

  if (companyName && (companyName.length < 3 || companyName.length > 255)) {
    return { error: "Company name must be between 3 and 255 characters" };
  }

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    // Check if user already exists
    const existingUsers = await query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUsers.length > 0) {
      return { error: "User with this email already exists" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const newUsers = await query<{ id: string; email: string }>(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    const newUser = newUsers[0];

    if (!newUser) {
      return { error: "Failed to create user" };
    }

    console.log("✅ User created:", newUser.id);

    // Create wallet set via Circle API
    try {
      const createdWalletSetResponse = await fetch(
        `${baseUrl}/api/wallet-set`,
        {
          method: "PUT",
          body: JSON.stringify({ entityName: email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!createdWalletSetResponse.ok) {
        throw new Error("Wallet set creation failed");
      }

      const createdWalletSet = await createdWalletSetResponse.json();
      console.log("✅ Wallet set created:", createdWalletSet.id);

      // Create wallet via Circle API
      const createdWalletResponse = await fetch(`${baseUrl}/api/wallet`, {
        method: "POST",
        body: JSON.stringify({ walletSetId: createdWalletSet.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!createdWalletResponse.ok) {
        throw new Error("Wallet creation failed");
      }

      const createdWallet = await createdWalletResponse.json();
      console.log("✅ Wallet created:", createdWallet.id);

      // Create profile
      const newProfiles = await query<{ id: number }>(
        "INSERT INTO profiles (user_id, email, name, company_name) VALUES ($1, $2, $3, $4) RETURNING id",
        [newUser.id, email, fullName || null, companyName || null]
      );

      const newProfile = newProfiles[0];

      if (!newProfile) {
        throw new Error("Could not create user profile");
      }

      console.log("✅ Profile created:", newProfile.id);

      // Create wallet entry
      await query(
        `INSERT INTO wallets (
          profile_id, circle_wallet_id, wallet_type, wallet_set_id,
          wallet_address, account_type, blockchain, currency
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newProfile.id,
          createdWallet.id,
          createdWallet.custodyType,
          createdWalletSet.id,
          createdWallet.address,
          createdWallet.accountType,
          createdWallet.blockchain,
          "USDC",
        ]
      );

      console.log("✅ Wallet linked to profile");
    } catch (error: any) {
      console.error("Error during wallet creation:", error.message);
      // Rollback: Delete user if wallet creation fails
      await query("DELETE FROM users WHERE id = $1", [newUser.id]);
      return { error: "Failed to set up user account. Please try again." };
    }
  } catch (error: any) {
    console.error("Sign up error:", error.message);
    return { error: "Failed to create account. Please try again." };
  }

  // Success - redirect to sign-in
  return { success: true, redirectTo: "/sign-in" };
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("📧 Sign-in attempt for:", email);

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // This will trigger the authorize function in auth.ts
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // Important: specify redirect here
    });

    // If we reach here, sign-in was successful
    // NextAuth will handle the redirect automatically
    return { success: true };
  } catch (error: any) {
    console.error("❌ Sign-in error:", error);

    // Handle specific NextAuth errors
    if (error.type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }

    if (error.type === "CallbackRouteError") {
      return { error: "Authentication failed. Please try again." };
    }

    // Re-throw redirect errors (NextAuth uses these for navigation)
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return { error: "Something went wrong. Please try again." };
  }
};



export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  try {
    // Check if user exists
    const users = await query<{ id: string }>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    // Don't reveal if user exists (security best practice)
    if (users.length === 0) {
      return encodedRedirect(
        "success",
        "/forgot-password",
        "If an account exists, we sent a password reset link."
      );
    }

    // Generate reset token
    const resetToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await query(
      "INSERT INTO verification_tokens (identifier, token, expires) VALUES ($1, $2, $3) ON CONFLICT (identifier, token) DO UPDATE SET expires = $3",
      [email, resetToken, expires]
    );

    // TODO: Send email with reset link
    // const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    // await sendEmail(email, resetLink);

    console.log(`Password reset token for ${email}:`, resetToken);

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a password reset link."
    );
  } catch (error: any) {
    console.error("Password reset error:", error.message);
    return { error: "Failed to process password reset. Please try again." };
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const token = formData.get("token") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Passwords do not match"
    );
  }

  if (password.length < 6) {
    return encodedRedirect(
      "error",
      "/reset-password",
      "Password must be at least 6 characters"
    );
  }

  try {
    // Verify token
    const tokens = await query<{ identifier: string; expires: Date }>(
      "SELECT identifier, expires FROM verification_tokens WHERE token = $1",
      [token]
    );

    if (tokens.length === 0 || new Date(tokens[0].expires) < new Date()) {
      return encodedRedirect(
        "error",
        "/reset-password",
        "Invalid or expired reset token"
      );
    }

    const email = tokens[0].identifier;

    // Update password
    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2",
      [passwordHash, email]
    );

    // Delete used token
    await query("DELETE FROM verification_tokens WHERE token = $1", [token]);

    return encodedRedirect(
      "success",
      "/sign-in",
      "Password updated successfully"
    );
  } catch (error: any) {
    console.error("Password update error:", error.message);
    return { error: "Failed to update password. Please try again." };
  }
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/sign-in" });
};

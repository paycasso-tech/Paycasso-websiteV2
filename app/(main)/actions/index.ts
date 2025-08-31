"use server";

import { encodedRedirect } from "@/lib/utils/utils";
import { createClient, createServiceClient } from "@/lib/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasEnvVars } from "@/lib/utils/supabase/check-env-vars";

const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  ? process.env.NEXT_PUBLIC_VERCEL_URL
  : "http://localhost:3000";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const companyName = formData.get("company-name")?.toString().trim();
  const fullName = formData.get("full-name")?.toString().trim();

  // Check if environment variables are properly configured
  if (!hasEnvVars) {
    console.error("Supabase environment variables are not configured");
    return { error: "Server configuration error. Please try again later." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  const headerStore = await headers(); 
  const origin = (await headers()).get("origin");

  if (fullName && (fullName.length < 3 || fullName.length > 255)) {
    return { error: "Full name must be between 3 and 255 characters" };
  }

  if (companyName && (companyName.length < 3 || companyName.length > 255)) {
    return { error: "Company name must be between 3 and 255 characters" };
  }

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const { error, data: authData } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    }

    try {
      const createdWalletSetResponse = await fetch(`${baseUrl}/api/wallet-set`, {
        method: "PUT",
        body: JSON.stringify({
          entityName: email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const createdWalletSet = await createdWalletSetResponse.json();

      const createdWalletResponse = await fetch(`${baseUrl}/api/wallet`, {
        method: "POST",
        body: JSON.stringify({
          walletSetId: createdWalletSet.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const createdWallet = await createdWalletResponse.json();

      // Create profile using service client to bypass RLS
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("SUPABASE_SERVICE_ROLE_KEY is not configured");
        return { error: "Server configuration error. Please try again later." };
      }

      const serviceClient = createServiceClient();
             const { data: profileData, error: profileError } = await serviceClient
         .from("profiles")
         .upsert({
           auth_user_id: authData.user?.id,
           email,
           name: fullName,
           company_name: companyName
         }, {
           onConflict: 'auth_user_id'
         })
         .select()
         .single();

      if (profileError) {
        console.error("Error while attempting to create user profile:", profileError);
                 console.error("Profile data that failed:", {
           auth_user_id: authData.user?.id,
           email,
           name: fullName,
           company_name: companyName
         });
        return { error: "Could not create user profile" };
      }

      console.log("Profile created successfully:", profileData);

      // Validate that we have all required data
      if (!profileData?.id) {
        console.error("Profile data is missing or invalid:", profileData);
        return { error: "Profile data is invalid" };
      }

      if (!createdWallet?.id || !createdWalletSet?.id) {
        console.error("Wallet or wallet set data is missing:", { createdWallet, createdWalletSet });
        return { error: "Wallet setup data is invalid" };
      }

      console.log("Creating wallet with profile_id:", profileData.id);

             const { error: walletError } = await serviceClient
         .from("wallets")
         .insert({
           profile_id: profileData.id,
           circle_wallet_id: createdWallet.id,
           wallet_type: createdWallet.custodyType,
           wallet_set_id: createdWalletSet.id,
           wallet_address: createdWallet.address,
           account_type: createdWallet.accountType,
           blockchain: createdWallet.blockchain,
           currency: "USDC",
         })
         .select();

      if (walletError) {
        console.error(
          "Error while attempting to create user's wallet:",
          walletError,
        );
        return { error: "Could not create wallet" };
      }
    } catch (error: any) {
      console.error("Error during wallet creation:", error.message);
      return { error: "Failed to set up user account. Please try again." };
    }
  } catch (error: any) {
    console.error("Network error during sign up:", error.message);
    return { error: "Network error. Please check your connection and try again." };
  }

  return { success: true, redirectTo: "/dashboard" };
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Check if environment variables are properly configured
  if (!hasEnvVars) {
    console.error("Supabase environment variables are not configured");
    return { error: "Server configuration error. Please try again later." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  try {
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return encodedRedirect("error", "/sign-in", error.message);
    }

    return { success: true, redirectTo: "/dashboard" };
  } catch (error: any) {
    console.error("Network error during sign in:", error.message);
    return { error: "Network error. Please check your connection and try again." };
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  // Check if environment variables are properly configured
  if (!hasEnvVars) {
    console.error("Supabase environment variables are not configured");
    return { error: "Server configuration error. Please try again later." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
    });

    if (error) {
      console.error(error.message);
      return encodedRedirect(
        "error",
        "/forgot-password",
        "Could not reset password",
      );
    }

    if (callbackUrl) {
      return redirect(callbackUrl);
    }

    return encodedRedirect(
      "success",
      "/forgot-password",
      "Check your email for a link to reset your password.",
    );
  } catch (error: any) {
    console.error("Network error during password reset:", error.message);
    return { error: "Network error. Please check your connection and try again." };
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Check if environment variables are properly configured
  if (!hasEnvVars) {
    console.error("Supabase environment variables are not configured");
    return { error: "Server configuration error. Please try again later." };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return { error: "Unable to connect to authentication service. Please try again later." };
  }

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return encodedRedirect(
        "error",
        "/dashboard/reset-password",
        "Password update failed",
      );
    }

    return encodedRedirect("success", "/dashboard/reset-password", "Password updated");
  } catch (error: any) {
    console.error("Network error during password update:", error.message);
    return { error: "Network error. Please check your connection and try again." };
  }
};

export const signOutAction = async () => {
  // Check if environment variables are properly configured
  if (!hasEnvVars) {
    console.error("Supabase environment variables are not configured");
    return redirect("/sign-in");
  }

  let supabase;
  try {
    supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Failed to sign out:", error);
    // Still redirect even if sign out fails
  }
  
  return redirect("/sign-in");
};

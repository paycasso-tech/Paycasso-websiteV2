"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// Helper function to store auth token in cookie
async function storeAuthToken(token: string, email: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  cookieStore.set({
    name: "user_email",
    value: email,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

// Helper function to get auth token from cookie
async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
}

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full-name")?.toString();
  const companyName = formData.get("company-name")?.toString();

  // Validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    // Call backend register endpoint
    const registerResponse = await fetch(`${BACKEND_URL}/api/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: fullName || email.split("@")[0],
        companyName,
      }),
    });

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      return { error: registerData.error || "Failed to create account" };
    }

    console.log("✅ User registered:", registerData.email);

    // Store token temporarily for wallet initialization
    await storeAuthToken(registerData.token, registerData.email);

    // Redirect to email verification page
    return {
      success: true,
      redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
      message: registerData.message,
    };
  } catch (error: any) {
    console.error("Sign up error:", error.message);
    return { error: "Failed to create account. Please try again." };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log("📧 Sign-in attempt for:", email);

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // Call backend login endpoint
    const loginResponse = await fetch(`${BACKEND_URL}/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      // Check if email is not verified
      if (loginData.emailVerified === false) {
        return {
          error: loginData.error,
          emailVerified: false,
          redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
        };
      }
      return { error: loginData.error || "Invalid email or password" };
    }

    console.log("✅ Login successful:", loginData.email);

    // Store token in secure HTTP-only cookie
    await storeAuthToken(loginData.token, loginData.email);

    // Initialize wallet after successful login
    try {
      const walletResponse = await fetch(`${BACKEND_URL}/api/user/getWallet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
          "x-user-email": loginData.email,
        },
      });

      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        console.log("✅ Wallet loaded:", walletData.wallet?.address);
      }
    } catch (walletError: any) {
      console.error("Wallet loading error:", walletError.message);
    }

    // If using NextAuth, sign in with credentials
    try {
      await signIn("credentials", {
        email,
        password,
        token: loginData.token,
        redirect: false,
      });
    } catch (authError: any) {
      if (authError instanceof AuthError) {
        console.error("NextAuth error:", authError.message);
      }
    }

    // Return success and let the client handle redirect
    return { success: true };
  } catch (error: any) {
    console.error("❌ Sign-in error:", error);

    // Re-throw redirect errors (NextAuth uses these for navigation)
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return { error: "Something went wrong. Please try again." };
  }
};

export const verifyEmailAction = async (email: string, otp: string) => {
  try {
    if (!email || !otp) {
      return { error: "Email and OTP are required" };
    }

    const response = await fetch(`${BACKEND_URL}/api/user/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Verification failed" };
    }

    console.log("✅ Email verified:", email);

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Verification error:", error.message);
    return { error: "Network error. Please try again." };
  }
};

export const resendOTPAction = async (email: string) => {
  try {
    if (!email) {
      return { error: "Email is required" };
    }

    const response = await fetch(
      `${BACKEND_URL}/api/user/resend-verification-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to resend OTP" };
    }

    console.log("✅ OTP resent to:", email);

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Resend OTP error:", error.message);
    return { error: "Network error. Please try again." };
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();

  if (!email) {
    return { error: "Email is required" };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/user/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to send reset link" };
    }

    console.log("✅ Password reset email sent to:", email);

    return {
      success: true,
      message: data.message || "Check your email for a password reset link.",
    };
  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    return { error: "Network error. Please try again." };
  }
};

export const resetPasswordAction = async (formData: FormData) => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const token = formData.get("token") as string;
  const email = formData.get("email") as string;

  if (!password || !confirmPassword) {
    return { error: "Password and confirm password are required" };
  }

  if (!token || !email) {
    return { error: "Invalid reset link" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        email,
        newPassword: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Password reset failed" };
    }

    console.log("✅ Password reset successful for:", email);

    return {
      success: true,
      message: data.message || "Password reset successful",
    };
  } catch (error: any) {
    console.error("Reset password error:", error.message);
    return { error: "Network error. Please try again." };
  }
};

export const signOutAction = async () => {
  try {
    // Clear auth cookies
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_email");

    // NextAuth signOut
    await signOut({
      redirect: true,
      redirectTo: "/sign-in",
    });
  } catch (error: any) {
    console.error("Sign out error:", error.message);
    redirect("/sign-in");
  }
};

// Helper action to get current user from backend
export const getCurrentUser = async () => {
  try {
    const token = await getAuthToken();
    const cookieStore = await cookies();
    const email = cookieStore.get("user_email")?.value;

    if (!token || !email) {
      return null;
    }

    const response = await fetch(`${BACKEND_URL}/api/user/getWallet`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-email": email,
      },
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error: any) {
    console.error("Get current user error:", error.message);
    return null;
  }
};

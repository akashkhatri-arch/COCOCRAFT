"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== "your-supabase-url" && key !== "your-supabase-anon-key");
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const mockUserCookie = cookieStore.get("cococraft_demo_user");

  if (mockUserCookie?.value) {
    try {
      return JSON.parse(mockUserCookie.value) as AuthUser;
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured()) {
    // Default fallback demo user if present or null
    return null;
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      name: profile?.full_name || user.user_metadata?.full_name || "Valued Customer",
      role: (profile?.role as "admin" | "customer") || "customer",
    };
  } catch {
    return null;
  }
}

export async function loginAction(formData: {
  email: string;
  password?: string;
  isDemoAdmin?: boolean;
  isDemoCustomer?: boolean;
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  const cookieStore = await cookies();

  // Quick Demo logins for reviewer / development testing
  if (formData.isDemoAdmin) {
    const adminUser: AuthUser = {
      id: "admin-demo-001",
      email: "admin@cococraft.in",
      name: "COCOCRAFT Head Chocolatier",
      role: "admin",
    };
    cookieStore.set("cococraft_demo_user", JSON.stringify(adminUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
    });
    return { success: true, user: adminUser };
  }

  if (formData.isDemoCustomer) {
    const customerUser: AuthUser = {
      id: "demo-user-123",
      email: "elena@example.com",
      name: "Elena Sharma",
      role: "customer",
    };
    cookieStore.set("cococraft_demo_user", JSON.stringify(customerUser), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
    });
    return { success: true, user: customerUser };
  }

  const email = formData.email.trim().toLowerCase();
  const password = formData.password || "";

  if (!email || !email.includes("@")) {
    return { success: false, error: "Please enter a valid email address" };
  }
  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  if (!isSupabaseConfigured()) {
    // Local mock login
    const isAdmin = email.includes("admin");
    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Customer",
      role: isAdmin ? "admin" : "customer",
    };
    cookieStore.set("cococraft_demo_user", JSON.stringify(user), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "lax",
    });
    return { success: true, user };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: error?.message || "Invalid email or password." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile?.full_name || "Valued Customer",
      role: profile?.role === "admin" ? "admin" : "customer",
    };

    return { success: true, user };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to sign in.";
    return { success: false, error: errorMsg };
  }
}

export async function signupAction(formData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  const cookieStore = await cookies();
  const email = formData.email.trim().toLowerCase();
  const name = formData.name.trim();

  // If supabase is not configured, register in cookie store for demo mode
  if (!isSupabaseConfigured()) {
    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role: "customer",
    };
    cookieStore.set("cococraft_demo_user", JSON.stringify(user), {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true, user };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: formData.password,
      options: {
        data: {
          full_name: name,
          phone: formData.phone || "",
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const user: AuthUser = {
      id: data.user?.id || `usr-${Date.now()}`,
      email,
      name,
      role: "customer",
    };

    return { success: true, user };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to sign up.";
    return { success: false, error: errorMsg };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("cococraft_demo_user");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  return { success: true };
}

export async function forgotPasswordAction(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.resetPasswordForEmail(email);
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    message: "If an account exists with this email, a password reset link has been dispatched.",
  };
}

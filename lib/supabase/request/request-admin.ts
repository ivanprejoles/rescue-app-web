// lib/supabaseAdmin.ts
import { User } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "../server";
import { AdminInfo } from "@/lib/types";

export async function handleAdminAccess(
  clerkUser: User
): Promise<{ isAdmin: boolean; adminInfo: AdminInfo | null }> {
  const supabase = await createServerSupabaseClient();

  // 1. Check if any admin exists
  const { data: admins, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .limit(1);

  if (adminError) {
    console.error("Supabase admin check error:", adminError);
    throw adminError;
  }

  // 2. If at least one admin exists
  if (admins && admins.length > 0) {
    // Check if current user is an admin
    const { data: admin, error: adminCheckError } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", clerkUser.id)
      .single();

    if (adminCheckError || !admin) {
      // User is not an admin
      return { isAdmin: false, adminInfo: null };
    }
    // User is an admin
    return { isAdmin: true, adminInfo: admin };
  }

  // 3. If no admin exists, insert current user as admin
  const { data: newAdmin, error: insertError } = await supabase
    .from("admins")
    .insert([
      {
        user_id: clerkUser.id,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
        phone_number: clerkUser.phoneNumbers?.[0]?.phoneNumber ?? null,
        role: "superadmin",
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Supabase admin insert error:", insertError);
    throw insertError;
  }

  return { isAdmin: true, adminInfo: newAdmin };
}

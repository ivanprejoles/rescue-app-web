/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "../server";
import { ClientAccessUser } from "@/lib/types";

export async function handleClientAccess(clerkUser: User): Promise<{
  user: { id: string; name: string; brgy_id: string | null } | null;
  isUser: boolean;
}> {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("id, name, brgy_id")
      .eq("user_id", clerkUser.id)
      .maybeSingle();

    if (selectError) {
      console.error("Error fetching user", selectError);
      return { user: null, isUser: false };
    }

    if (existingUser) {
      return { user: existingUser, isUser: true };
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        user_id: clerkUser.id,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        status: "active",
        user_type: "unverified",
        email: clerkUser.emailAddresses[0]?.emailAddress || null,
      })
      .select("id, name, brgy_id")
      .maybeSingle();

    if (insertError) {
      console.error("Error inserting new user", insertError);
      return { user: null, isUser: false };
    }

    if (newUser) {
      return { user: newUser, isUser: true };
    }

    return { user: null, isUser: false };
  } catch (error) {
    console.error("Unexpected error in handleClientAccess:", error);
    return { user: null, isUser: false };
  }
}

export async function getClientProfile(userId: string) {
  const supabase = await createServerSupabaseClient();

  // Get user profile with related barangay (optional)
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select(
      `
      id,
      name,
      email,
      phone_number,
      status,
      imageUrl,
      created_at,
      address,
      user_type,
      barangays (
        id,
        name,
        address,
        latitude,
        longitude,
        phone
      )
    `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (selectError) {
    console.error("Error fetching user profile", selectError);
    throw selectError;
  }

  // Get all barangays separately
  const { data: allBarangays, error: barangaysError } = await supabase
    .from("barangays")
    .select("id, name");

  if (barangaysError) {
    console.error("Error fetching all barangays", barangaysError);
    throw barangaysError;
  }

  return {
    user: existingUser as ClientAccessUser | null,
    allBarangays: allBarangays || [],
  };
}

export async function updateClientProfile(
  id: string,
  data: {
    name: string;
    phone_number: string;
    brgyId: string;
    address: string;
    imageUrl?: string;
  }
) {
  const supabase = await createServerSupabaseClient();

  const { data: updatedUser, error: updatedError } = await supabase
    .from("users")
    .update({
      phone_number: data.phone_number,
      brgy_id: data.brgyId,
      name: data.name,
      address: data.address,
      imageUrl: data.imageUrl,
    })
    .eq("id", id)
    .select(
      `
        id,
        name,
        email,
        phone_number,
        status,
        user_type,
        created_at,
        address,
        barangays (
          id,
          name,
          address,
          latitude,
          longitude,
          phone
        )
      `
    );

  if (updatedError) {
    console.error("Error updating user profile", updatedError);
    throw updatedError;
  }
  if (!updatedUser || updatedUser.length === 0)
    throw new Error("User not found or not updated");
  return updatedUser[0];
}

export async function getClientReport(userId: string) {
  const supabase = await createServerSupabaseClient();

  // Step 1: Get user info including the UUID id
  const { data: existingUser, error: userError } = await supabase
    .from("users")
    .select(
      `
      id,
      name,
      email,
      phone_number,
      status,
      address,
      created_at,
      user_type,
      brgy_id
    `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (userError || !existingUser) {
    throw userError || new Error("User not found");
  }

  const [markersRes, evacuationRes] = await Promise.all([
    supabase.from("markers").select(`
        id,
        type,
        description,
        latitude,
        longitude,
        imageUrl,
        status,
        created_at,
        updated_at,
        user: user_id (
          id,
          name,
          email,
          phone_number,
          status,
          brgy_id
        ),
        rescuer: rescuer_id (
          id,
          name,
          email,
          phone_number,
          status,
          brgy_id
        ),
        barangay: brgy_id (
          id,
          phone,
          name,
          address
        )
      `),

    supabase.from("evacuation_centers").select(
      `id,
      name, 
      address,
      imageUrl, 
      latitude, 
      longitude, 
      phone, 
      status, 
      evacuation_center_barangays ( barangay_id )`
    ),
  ]);

  if (markersRes.error) throw markersRes.error;
  if (evacuationRes.error) throw evacuationRes.error;

  return {
    user: existingUser,
    markers: markersRes.data,
    evacuationCenters: evacuationRes.data,
  };
}

export async function createClientReport(data: {
  latitude: number;
  longitude: number;
  description: string;
  user_id: string;
  brgy_id: string;
  imageUrl: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: inserted, error } = await supabase
    .from("markers")
    .insert({
      type: "report",
      latitude: data.latitude,
      longitude: data.longitude,
      imageUrl: data.imageUrl,
      description: data.description,
      brgy_id: data.brgy_id,
      user_id: data.user_id,
      status: "Pending",
    })
    .select(
      `
        id,
        type,
        description,
        latitude,
        longitude,
        status,
        imageUrl,
        created_at,
        updated_at,
        user: user_id (
          id,
          name,
          email,
          phone_number,
          status,
          brgy_id
        ),
        rescuer: rescuer_id (
          id,
          name,
          email,
          phone_number,
          status,
          brgy_id
        ),
        barangay: brgy_id (
          id,
          phone,
          name,
          address
        )
      `
    )
    .single();
  if (error) {
    console.error("Error creating report", error);
    throw error;
  }
  return inserted;
}

export async function updateClientReport(id: string, updates: Partial<any>) {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase
    .from("markers")
    .update(updates)
    .eq("id", id)
    .select(
      `id,
        type,
        description,
        latitude,
        imageUrl,
        longitude,
        status,
        created_at,
        updated_at,
        user: user_id (
          id,
          name,
          email,
          phone_number,
          status,
          brgy_id
        ),
        rescuer: rescuer_id (
          id,
          name,
          email,
          phone_number,
          status,
          brgy_id
        ),
        barangay: brgy_id (
          id,
          phone,
          name,
          address
        )
      `
    )
    .single();

  if (error) {
    console.error("[updateClientReport]", error.message);
    throw error;
  }
  return updated;
}

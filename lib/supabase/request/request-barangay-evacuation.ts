import { createServerSupabaseClient } from "../server";

export async function getEvacuationAndBarangaysForAdmin(userId: string) {
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createServerSupabaseClient();

  const evacuationRes = await supabase
    .from("evacuation_centers")
    .select(
      `
      *,
      evacuation_center_barangays (
        barangay_id
      )
    `
    )
    .order("name", { ascending: true });

  if (evacuationRes.error) {
    console.error("[getEvacuation]", evacuationRes.error.message);
    throw new Error("Failed to load evacuation centers");
  }

  const barangayRes = await supabase
    .from("barangays")
    .select("*")
    .order("name", { ascending: true });

  if (barangayRes.error) {
    console.error("[getBarangays]", barangayRes.error.message);
    throw new Error("Failed to load barangays");
  }

  return {
    evacuations: evacuationRes.data ?? [],
    barangays: barangayRes.data ?? [],
  };
}

// CREATE

export async function createEvacuationCenter(data: {
  name: string;
  address?: string | null;
  latitude?: number | null;
  imageUrl?: string | null;
  longitude?: number | null;
  phone?: string | null;
  status?: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: inserted, error } = await supabase
    .from("evacuation_centers")
    .insert([
      {
        name: data.name,
        address: data.address ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        phone: data.phone ?? null,
        imageUrl: data.imageUrl ?? null,
        status: data.status ?? "open",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[createEvacuationCenter]", error.message);
    throw error;
  }

  return inserted;
}

export async function createBarangay(data: {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: inserted, error } = await supabase
    .from("barangays")
    .insert([
      {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("[createBarangay]", error.message);
    throw error;
  }

  return inserted;
}

// UPDATE

export async function updateEvacuationCenter(
  id: string,
  updates: Partial<{
    name: string;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    phone?: string | null;
    status?: string | null;
    imageUrl?: string | null;
  }>
) {
  const supabase = await createServerSupabaseClient();

  const { data: updated, error } = await supabase
    .from("evacuation_centers")
    .update({
      ...updates,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateEvacuationCenter]", error.message);
    throw error;
  }

  return updated;
}

export async function updateBarangay(
  id: string,
  updates: Partial<{
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    phone?: string;
  }>
) {
  const supabase = await createServerSupabaseClient();

  const { data: updated, error } = await supabase
    .from("barangays")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateBarangay]", error.message);
    throw error;
  }

  return updated;
}

// DELETE

export async function deleteEvacuationCenter(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("evacuation_centers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteEvacuationCenter]", error.message);
    throw error;
  }

  return { success: true };
}

export async function deleteBarangay(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("barangays").delete().eq("id", id);

  if (error) {
    console.error("[deleteBarangay]", error.message);
    throw error;
  }

  return { success: true };
}

// ADD AND REMOVE
export async function addBarangaysToEvacuationCenter(
  evacuationCenterId: string,
  barangayIds: string[]
) {
  const supabase = await createServerSupabaseClient();

  const insertPayload = barangayIds.map((barangay_id) => ({
    evacuation_center_id: evacuationCenterId,
    barangay_id,
  }));

  const { data, error } = await supabase
    .from("evacuation_center_barangays")
    .insert(insertPayload);

  if (error) {
    console.error("[addBarangaysToEvacuationCenter]", error.message);
    throw error;
  }

  return data;
}

export async function removeBarangaysFromEvacuationCenter(
  evacuationCenterId: string,
  barangayIds: string[]
) {
  if (barangayIds.length === 0) return;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("evacuation_center_barangays")
    .delete()
    .eq("evacuation_center_id", evacuationCenterId)
    .in("barangay_id", barangayIds);

  if (error) {
    console.error("[removeBarangaysFromEvacuationCenter]", error.message);
    throw error;
  }

  return data;
}

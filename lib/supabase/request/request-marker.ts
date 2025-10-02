import { createServerSupabaseClient } from "../server";

export async function getReportMarkersOnly(userId: string) {
  if (!userId) throw new Error("Unauthorized");

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("markers")
    .select(
      `
      id,
      type,
      description,
      latitude,
      longitude,
      status,
      created_at,
      updated_at,
      users:user_id (
        id,
        name,
        email,
        phone_number,
        user_type,
        status,
        brgy_id
      ),
      rescuers:rescuer_id (
        id,
        name,
        email,
        phone_number,
        user_type,
        status,
        brgy_id
      ),
      barangays:brgy_id (
        id,
        name
      )
    `
    )
    .eq("type", "report")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function createMarker(data: any) {
  const supabase = await createServerSupabaseClient();

  const { data: inserted, error } = await supabase
    .from("markers")
    .insert({
      type: data.type,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description || null,
      status: data.status || "Active",
      rescuer_id: null,
      brgy_id: data.brgyId || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[createMarker]", error.message);
    throw error;
  }

  return inserted;
}

export async function updateMarker(id: string, updates: Partial<any>) {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase
    .from("markers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[updateMarker]", error.message);
    throw error;
  }
  return updated;
}

export async function deleteMarker(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("markers").delete().eq("id", id);

  if (error) {
    console.error("[deleteMarker]", error.message);
    throw error;
  }

  return { success: true };
}

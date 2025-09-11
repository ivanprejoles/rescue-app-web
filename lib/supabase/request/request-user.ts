import { createServerSupabaseClient } from "../server";

export async function getRescuersAndUsers() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select(
      `
      *,
      barangays (
        id, name, address, latitude, longitude
      ),
      markers_as_user:markers!markers_user_id_fkey (
        id, type, description, latitude, longitude, status, created_at, updated_at
      ),
      markers_as_rescuer:markers!markers_rescuer_id_fkey (
        id, type, description, latitude, longitude, status, created_at, updated_at
      )
    `
    )
    .in("user_type", ["user", "rescuer"])
    .order("name");

  if (error) throw error;

  // Separate users by user_type
  const rescuers = data?.filter((u) => u.user_type === "rescuer") ?? [];
  const users = data?.filter((u) => u.user_type === "user") ?? [];

  return {
    rescuers,
    users,
  };
}

export async function updateUserRescuer(
  id: string,
  updates: Partial<{
    status: string;
  }>
) {
  const supabase = await createServerSupabaseClient();
  const { data: updated, error } = await supabase
    .from("users")
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

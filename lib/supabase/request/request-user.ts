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
      )
    `
    )
    .in("user_type", ["user", "rescuer", "unverified"])
    .order("name");

  if (error) throw error;

  // Separate users by user_type
  const rescuers = data?.filter((u) => u.user_type === "rescuer") ?? [];
  const users = data?.filter((u) => u.user_type === "user") ?? [];
  const unverifieds = data?.filter((u) => u.user_type === "unverified") ?? [];

  return {
    rescuers,
    users,
    unverifieds,
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

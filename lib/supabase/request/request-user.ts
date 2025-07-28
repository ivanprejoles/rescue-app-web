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

  console.log(data);

  // Separate users by user_type
  const rescuers = data?.filter((u) => u.user_type === "rescuer") ?? [];
  const users = data?.filter((u) => u.user_type === "user") ?? [];

  return {
    rescuers,
    users,
  };
}

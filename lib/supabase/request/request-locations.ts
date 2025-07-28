import { createServerSupabaseClient } from "../server";

export async function getAllLocationsForMap() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("locations")
    .select("*") // select all columns, or specify columns you need
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return data;
}

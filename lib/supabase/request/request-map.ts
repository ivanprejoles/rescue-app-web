import { createServerSupabaseClient } from "../server"; // your server supabase factory

export async function getAllMarkersForMap() {
  const supabase = createServerSupabaseClient();

  // Perform all queries concurrently
  const [markersRes, barangaysRes, evacuationRes] = await Promise.all([
    (await supabase).from("markers").select(`
        id,
        type,
        description,
        latitude,
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
      `),

    (await supabase)
      .from("barangays")
      .select("id, name, address, latitude, longitude, phone"),

    (await supabase)
      .from("evacuation_centers")
      .select("id, name, address, latitude, longitude, phone, status"),
  ]);

  if (markersRes.error) throw markersRes.error;
  if (barangaysRes.error) throw barangaysRes.error;
  if (evacuationRes.error) throw evacuationRes.error;

  return {
    markers: markersRes.data,
    barangays: barangaysRes.data,
    evacuationCenters: evacuationRes.data,
  };
}

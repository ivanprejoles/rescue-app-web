import { v4 as uuidv4 } from "uuid";
import { QueryClient } from "@tanstack/react-query";
import { UserResource } from "@clerk/types";

export function toggleReportSelection(
  current: StoredMarkerType[],
  report: StoredMarkerType
): StoredMarkerType[] {
  const exists = current.find((r) => r.id === report.id);
  if (exists) return current.filter((r) => r.id !== report.id);
  return current.length < 2 ? [...current, report] : [current[1], report];
}

// export async function createMarker(
//   latlng: L.LatLng,
//   selectedType: string,
//   user: UserResource,
//   queryClient: QueryClient
// ) {
//   const timestamp = new Date().toISOString();
//   const tempId = `temp-${uuidv4()}`;

//   const optimisticMarker: StoredMarkerType = {
//     id: tempId,
//     lat: latlng.lat,
//     lng: latlng.lng,
//     type: selectedType,
//     status: "active",
//     additional_info: {
//       placed_by: "admin",
//       local_time: timestamp,
//     },
//     name: undefined,
//     description: undefined,
//     user_id: null,
//     rescuer_id: null,
//     created_at: timestamp,
//     updated_at: timestamp,
//   };

//   queryClient.setQueryData<StoredMarkerType[]>(["markers"], (prev = []) => [
//     ...prev,
//     optimisticMarker,
//   ]);

//   try {
//     const res = await fetch("/api/admin/markers", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         marker: {
//           lat: optimisticMarker.lat,
//           lng: optimisticMarker.lng,
//           name: optimisticMarker.name,
//           type: optimisticMarker.type,
//           status: optimisticMarker.status,
//           additional_info: optimisticMarker.additional_info,
//         },
//         userId: user.id,
//       }),
//     });

//     const result = await res.json();
//     if (!res.ok) throw new Error(result.error || "Failed to save marker");
//     return result.data;
//   } catch (error: any) {
//     queryClient.setQueryData<StoredMarkerType[]>(["markers"], (prev = []) =>
//       prev.filter((m) => m.id !== tempId)
//     );
//     throw error;
//   }
// }

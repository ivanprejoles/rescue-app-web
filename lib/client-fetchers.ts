// Folder structure: /lib/client-fetchers.ts

// 1. Announcements
export async function getAnnouncementsClient() {
  const res = await fetch("/api/admin/announcements");
  if (!res.ok) throw new Error("Failed to fetch announcements");
  return res.json();
}

// 2. Evacuation Centers
export async function getEvacuationCentersClient() {
  const res = await fetch("/api/admin/evacuations");
  if (!res.ok) throw new Error("Failed to fetch evacuation centers");
  return res.json();
}

// 3. Rescue Markers
export async function getMarkersClient() {
  const res = await fetch("/api/admin/markers");
  if (!res.ok) throw new Error("Failed to fetch rescue markers");
  return res.json();
}

// 4. Rescuers and Users
export async function getRescuersAndUsersClient() {
  const res = await fetch("/api/admin/rescuers-and-users");
  if (!res.ok) throw new Error("Failed to fetch rescuers and users");
  return res.json(); // returns { rescuers: [], users: [] }
}

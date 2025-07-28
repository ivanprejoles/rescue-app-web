import { Announcement } from "../types";

// api clients for announcements based on your barangayClient example
export async function createAnnouncementClient(data: Omit<Announcement, "id">) {
  const res = await fetch("/api/admin/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create announcement");
  }
  return res.json();
}

export async function updateAnnouncementClient(
  id: string,
  data: Partial<Omit<Announcement, "id">>
) {

  const res = await fetch("/api/admin/announcements", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update announcement");
  }
  return res.json();
}

export async function deleteAnnouncementClient(id: string) {
  const res = await fetch(`/api/admin/announcements/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete announcement");
  }
  return res.json();
}

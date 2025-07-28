export async function createEvacuationClient(data: {
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  status: string;
}) {
  const res = await fetch("/api/admin/evacuations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create barangay");
  }
  return res.json();
}

export async function updateEvacuationClient(
  id: string,
  data: Partial<{
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    phone?: string;
    status: string;
  }>
) {
  const res = await fetch("/api/admin/evacuations", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update barangay");
  }
  return res.json();
}

export async function deleteEvacuationClient(id: string) {
  const res = await fetch(`/api/admin/evacuations/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete barangay");
  }

  return res.json();
}

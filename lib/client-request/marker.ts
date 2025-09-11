export async function updateMarkerClient(
  id: string,
  data: Partial<{
    status: string;
  }>
) {
  const res = await fetch("/api/admin/markers", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update marker");
  }
  return res.json();
}

export async function deleteMarkerClient(id: string) {
  const res = await fetch(`/api/admin/markers/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete marker");
  }

  return res.json();
}

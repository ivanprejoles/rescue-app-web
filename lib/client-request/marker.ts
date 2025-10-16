export async function updateMarkerClient(
  id: string,
  data: Partial<{
    status: string;
  }>
) {
  const res = await fetch(`/api/admin/markers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update marker");
  }
  return res.json();
}

export async function assistMarkerRescuer(
  id: string,
  data: Partial<{
    rescuer_id: string;
  }>
) {
  const res = await fetch(`/api/admin/markers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to assist the user");
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

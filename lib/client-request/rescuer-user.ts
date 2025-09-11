export async function updateUserRescuerClient(
  id: string,
  data: {
    user_type: string;
  }
) {
  const res = await fetch("/api/admin/rescuers-and-users", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update user or rescuer");
  }
  return res.json();
}

export async function deleteUserRescuerClient(id: string) {
  const res = await fetch(`/api/admin/rescuers-and-users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete user or rescuer");
  }

  return res.json();
}

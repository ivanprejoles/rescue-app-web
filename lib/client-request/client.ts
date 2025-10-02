export async function updateClientProfile(
  id: string,
  data: Partial<{
    name: string;
    brgyId: string;
    phone_number: string;
  }>
) {
  const res = await fetch("/api/client/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update barangay");
  }
  return res.json();
}

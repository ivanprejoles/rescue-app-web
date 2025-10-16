/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServerSupabaseClient } from "../server";

export async function getAllAnnouncements() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createAnnouncement(data: any) {
  const supabase = await createServerSupabaseClient();

  const { title, description, status, date } = data;

  const { data: insertedData, error } = await supabase
    .from("announcements")
    .insert([{ title, description, status, date }])
    .select()
    .single();

  if (error) throw error;
  return insertedData;
}

export async function updateAnnouncement(data: any) {
  const supabase = await createServerSupabaseClient();
  const { id, title, description, status, date } = data;

  const { data: updatedData, error } = await supabase
    .from("announcements")
    .update({ title, description, status, date })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return updatedData;
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) throw error;
}

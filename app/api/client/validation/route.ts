/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateClientProfile } from "@/lib/supabase/request/request-client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { id, name, phone_number, brgyId, address, imageUrl } = body;
  if (!id || !phone_number || !brgyId || !name || !address || !imageUrl) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const updatedProfile = await updateClientProfile(id, {
      phone_number,
      brgyId,
      name,
      address,
      imageUrl,
    });
    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

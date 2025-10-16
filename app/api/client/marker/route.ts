/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createClientReport,
  getClientReport,
} from "@/lib/supabase/request/request-client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await getClientReport(userId);

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { latitude, longitude, description, brgy_id } = await request.json();
  try {
    const createdMarker = await createClientReport({
      latitude,
      longitude,
      description,
      user_id: userId,
      brgy_id,
    });
    return NextResponse.json(createdMarker);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

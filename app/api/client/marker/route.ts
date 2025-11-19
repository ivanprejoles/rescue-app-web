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
  try {
    // ✅ Step 1: Verify user is logged in via Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Step 2: Extract data from body
    const { latitude, longitude, description, brgy_id, user_id, imageUrl } =
      await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing location data" },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const createdMarker = await createClientReport({
      latitude,
      longitude,
      description,
      user_id, // Supabase UUID
      imageUrl,
      brgy_id,
    });

    return NextResponse.json(createdMarker, { status: 201 });
  } catch (error: any) {
    console.error("Error creating marker:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create marker" },
      { status: 500 }
    );
  }
}

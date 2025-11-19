/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  deleteMarker,
  updateMarker,
} from "@/lib/supabase/request/request-marker";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing marker id" }, { status: 400 });
  }

  try {
    await deleteMarker(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// for natural marker only, updates can be { type, description, latitude, longitude, status }

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ fixed

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      type,
      brgyId: brgy_id,
      description,
      latitude,
      longitude,
      status,
      imageUrl,
      rescuer_id,
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing marker id" }, { status: 400 });
    }

    const updatedMarker = await updateMarker(id, {
      type,
      brgy_id,
      description,
      latitude,
      imageUrl,
      longitude,
      status,
      rescuer_id,
    });

    console.log(updatedMarker);

    return NextResponse.json(updatedMarker, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

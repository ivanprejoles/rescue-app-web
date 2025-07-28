import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createBarangay,
  updateBarangay,
} from "@/lib/supabase/request/request-barangay-evacuation";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const { name, address, latitude, longitude, phone } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, latitude, longitude" },
        { status: 400 }
      );
    }

    const insertedBarangay = await createBarangay({
      name,
      address,
      latitude,
      longitude,
      phone,
    });

    return NextResponse.json(insertedBarangay, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing barangay id" },
        { status: 400 }
      );
    }

    // Optionally validate updates keys and types here

    const updatedBarangay = await updateBarangay(id, updates);

    return NextResponse.json(updatedBarangay, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

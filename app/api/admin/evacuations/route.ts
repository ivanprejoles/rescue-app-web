import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createEvacuationCenter,
  getEvacuationAndBarangaysForAdmin,
  updateEvacuationCenter,
} from "@/lib/supabase/request/request-barangay-evacuation";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const markers = await getEvacuationAndBarangaysForAdmin(userId);

    return NextResponse.json(markers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const { name, address, latitude, longitude, phone, status } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, latitude, longitude" },
        { status: 400 }
      );
    }
    console.log(body);

    const insertedBarangay = await createEvacuationCenter({
      name,
      address,
      latitude,
      longitude,
      phone,
      status,
    });

    return NextResponse.json(insertedBarangay, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

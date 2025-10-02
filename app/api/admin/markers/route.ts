import {
  createMarker,
  getReportMarkersOnly,
  updateMarker,
} from "@/lib/supabase/request/request-marker";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Missing marker data" },
        { status: 400 }
      );
    }

    // Validate coordinates present
    if (!body.latitude || !body.longitude) {
      return NextResponse.json(
        { error: "Missing coordinates" },
        { status: 400 }
      );
    }

    const marker = await createMarker(body);

    return NextResponse.json({ marker }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const markers = await getReportMarkersOnly(userId);

    return NextResponse.json(markers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

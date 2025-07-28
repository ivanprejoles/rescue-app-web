import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
} from "@/lib/supabase/request/request-announcement";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const markers = await getAllAnnouncements(userId);

    return NextResponse.json(markers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    // validate required fields like title, status
    if (!data.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newAnnouncement = await createAnnouncement(data);

    return NextResponse.json(newAnnouncement);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create announcement" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const { id } = data;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedAnnouncement = await updateAnnouncement(data);

    return NextResponse.json(updatedAnnouncement);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update announcement" },
      { status: 500 }
    );
  }
}

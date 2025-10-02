import {
  deleteEvacuationCenter,
  updateEvacuationCenter,
} from "@/lib/supabase/request/request-barangay-evacuation";
import { auth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";

interface Params {
  id: string;
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing barangay id" }, { status: 400 });
  }

  try {
    await deleteEvacuationCenter(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params; // no await here

  if (!id) {
    return NextResponse.json({ error: "Missing barangay id" }, { status: 400 });
  }

  try {
    const updates = await req.json(); // just parse the whole body as updates directly

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid updates data" },
        { status: 400 }
      );
    }

    const updatedBarangay = await updateEvacuationCenter(id, updates);

    return NextResponse.json(updatedBarangay, { status: 200 });
  } catch (error: any) {
    console.error("[PUT /api/admin/evacuations/:id]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

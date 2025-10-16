/* eslint-disable @typescript-eslint/no-explicit-any */
import { updateClientReport } from "@/lib/supabase/request/request-client";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // no await here

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await req.json(); // just p   arse the whole body as updates directly
    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid updates data" },
        { status: 400 }
      );
    }
    const updatedReport = await updateClientReport(id, updates);
    return NextResponse.json(updatedReport);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

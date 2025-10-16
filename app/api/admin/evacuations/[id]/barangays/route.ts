/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  addBarangaysToEvacuationCenter,
  removeBarangaysFromEvacuationCenter,
} from "@/lib/supabase/request/request-barangay-evacuation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Missing evacuation center ID" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    const { toAdd, toRemove } = body as {
      toAdd?: string[];
      toRemove?: string[];
    };

    // Basic validation
    if (
      (toAdd && !Array.isArray(toAdd)) ||
      (toRemove && !Array.isArray(toRemove))
    ) {
      return NextResponse.json(
        { error: "'toAdd' and 'toRemove' must be arrays" },
        { status: 400 }
      );
    }

    // Remove barangays first (if any)
    if (toRemove && toRemove.length > 0) {
      await removeBarangaysFromEvacuationCenter(id, toRemove);
    }

    // Add barangays next (if any)
    if (toAdd && toAdd.length > 0) {
      await addBarangaysToEvacuationCenter(id, toAdd);
    }

    return NextResponse.json(
      { message: "Barangays updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[updateEvacuationBarangays]", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

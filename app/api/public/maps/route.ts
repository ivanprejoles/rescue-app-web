/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPublicMarkers } from "@/lib/supabase/request/request-map";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getPublicMarkers();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

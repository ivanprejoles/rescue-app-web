import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRescuersAndUsers } from "@/lib/supabase/request/request-user";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const markers = await getRescuersAndUsers();

    return NextResponse.json(markers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

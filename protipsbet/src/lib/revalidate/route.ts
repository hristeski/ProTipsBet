// app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  revalidatePath("/");
  revalidatePath("/free-tips");
  revalidatePath("/vip-tips");
  revalidatePath("/history");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const { token } = await (auth() as any).api.getToken({
      headers: await (await import("next/headers")).headers(),
    });

    if (!token) {
      return NextResponse.json({ token: null }, { status: 401 });
    }

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ token: null }, { status: 401 });
  }
}

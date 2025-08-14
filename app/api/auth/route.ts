import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/db/session";

export async function GET(request:NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");

  if (!sessionToken) {
    return NextResponse.json(
      { authenticated: false, message: "Not logged in" },
      { status: 401 }
    );
  }

  const isValid = await verifySession(sessionToken.value);
  if (!isValid) {
    return NextResponse.json(
      { authenticated: false, message: "Invalid or expired session" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { authenticated: true, message: "User is logged in" },
    { status: 200 }
  );
}



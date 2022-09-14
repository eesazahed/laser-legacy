import { NextRequest, NextResponse } from "next/server";

const bannedIPS: string[] = [];

export async function middleware(req: NextRequest) {
  if (!bannedIPS.includes(String(req.ip))) {
    return NextResponse.next();
  } else {
    return NextResponse.rewrite(`${req.nextUrl.origin}/banned/`);
  }
}

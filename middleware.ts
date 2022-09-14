import { NextRequest, NextResponse } from "next/server";

const bannedIPS = ["173.33.4.162"];

export async function middleware(req: NextRequest) {
  console.log(req.ip);

  if (!bannedIPS.includes(String(req.ip))) {
    return NextResponse.next();
  } else {
    return NextResponse.rewrite(`${req.nextUrl.origin}/banned/`);
  }
}

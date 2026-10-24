import { NextResponse } from "next/server";

/** Stub for Webflow commerce GraphQL (not used on this static Next site). */
function ok() {
  return NextResponse.json(
    { data: null, errors: [{ message: "Webflow commerce disabled" }] },
    { status: 200 }
  );
}

export async function GET() {
  return ok();
}

export async function POST() {
  return ok();
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

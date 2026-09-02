import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
    passwordLength: process.env.SHIPROCKET_PASSWORD?.length,
    passwordStartsWithQuote: process.env.SHIPROCKET_PASSWORD?.startsWith('"'),
    hasHash: process.env.SHIPROCKET_PASSWORD?.includes('#'),
  });
}

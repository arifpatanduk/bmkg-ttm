import fetchAndSaveSolarData from "@/lib/cron";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await fetchAndSaveSolarData();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("SCRAPE_DATA", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

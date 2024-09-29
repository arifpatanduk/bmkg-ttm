import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cities = await db.city.findMany();

    return NextResponse.json(cities);
  } catch (error) {
    console.log("CITIES_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, lat, lon } = await req.json();

    if (!name || !lat || !lon) {
      return new NextResponse("Missing name, lat or lon", { status: 400 });
    }

    const city = await db.city.create({
      data: {
        name,
        lat,
        lon,
      },
    });

    return NextResponse.json(city);
  } catch (error) {
    console.log("CITIES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

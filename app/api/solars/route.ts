import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { cityId, startDate, endDate } = await req.json();
    const solar = await db.solarData.findMany({
      where: {
        cityId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    return NextResponse.json(solar);
  } catch (error) {
    console.log("SOLARS_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      cityId,
      date,
      sunrise,
      sunset,
      dawn,
      dusk,
      transit,
      transitAzimuth,
      riseAzimuth,
      setAzimuth,
    } = await req.json();

    // check if values exist based on cityId and date
    const solar = await db.solarData.findFirst({
      where: {
        cityId,
        date: new Date(date),
      },
    });

    if (solar) {
      return new NextResponse("Solar data already exists", { status: 400 });
    }

    const res = await db.solarData.create({
      data: {
        cityId,
        date: new Date(date),
        sunrise,
        sunset,
        dawn,
        dusk,
        transit,
        transitAzimuth,
        riseAzimuth,
        setAzimuth,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.log("CITIES_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

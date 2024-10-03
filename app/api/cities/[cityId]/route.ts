import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { cityId: string } }) {
  try {
    const city = await db.city.findUnique({
      where: {
        id: params.cityId,
      },
    });

    if (!city) {
      return new NextResponse("City not found", { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error) {
    console.log("CITY_GET", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

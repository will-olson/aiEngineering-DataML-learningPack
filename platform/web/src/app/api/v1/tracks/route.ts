import { NextRequest, NextResponse } from "next/server";
import { loadTracks } from "@/lib/catalog";

export async function GET(req: NextRequest) {
  const productArea = req.nextUrl.searchParams.get("product_area");
  let tracks = loadTracks();
  if (productArea) {
    tracks = tracks.filter((t) => t.product_area === productArea);
  }
  return NextResponse.json({ tracks });
}

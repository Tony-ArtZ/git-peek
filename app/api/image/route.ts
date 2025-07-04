import { NextRequest, NextResponse } from "next/server";
import { fetchImageFromRepo } from "@/actions/fetchImage";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repoId = searchParams.get("repoId");
  const imagePath = searchParams.get("path");

  if (!repoId || !imagePath) {
    return NextResponse.json(
      { error: "Missing repoId or path parameter" },
      { status: 400 }
    );
  }

  try {
    const imageData = await fetchImageFromRepo(repoId, imagePath);

    if (!imageData) {
      return NextResponse.json(
        { error: "Image not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ imageData });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

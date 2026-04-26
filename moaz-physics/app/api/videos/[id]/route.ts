import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        files: true,
        _count: { select: { purchases: true } },
      },
    });

    if (!video) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        url: body.url,
        thumbnail: body.thumbnail,
        duration: body.duration,
        category: body.category,
        price: body.price,
        isFree: body.isFree,
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json({ video });
  } catch (error) {
    console.error("Video update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.video.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
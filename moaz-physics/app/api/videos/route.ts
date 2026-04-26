import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isFree = searchParams.get("isFree");
    const search = searchParams.get("search");

    const where: any = {};
    if (category) where.category = category;
    if (isFree !== null) where.isFree = isFree === "true";
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const videos = await prisma.video.findMany({
      where,
      include: {
        files: true,
        _count: { select: { purchases: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Videos fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const video = await prisma.video.create({
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
    console.error("Video create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
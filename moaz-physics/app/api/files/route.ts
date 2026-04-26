import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const files = await prisma.file.findMany({
      include: { video: { select: { title: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Files fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const file = await prisma.file.create({
      data: {
        name: body.name,
        url: body.url,
        size: body.size,
        type: body.type,
        videoId: body.videoId || null,
      },
    });

    return NextResponse.json({ file });
  } catch (error) {
    console.error("File create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 });
    }

    await prisma.file.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("File delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
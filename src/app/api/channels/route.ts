import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID Missing", { status: 400 });

    if (name === "general")
      return new NextResponse("Name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        Members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        Channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNELS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

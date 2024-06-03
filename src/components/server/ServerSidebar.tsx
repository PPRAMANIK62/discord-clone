import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";

interface ServerSidebarProps {
  serverId: string;
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Members: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const textChannels = server?.Channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.Channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.Channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const members = server?.Members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");

  const role = server.Members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className=" flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role}/>
    </div>
  );
};

export default ServerSidebar;

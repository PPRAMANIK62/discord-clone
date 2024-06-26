import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import ServerChannel from "./ServerChannel";
import ServerHeader from "./ServerHeader";
import ServerSearch from "./ServerSearch";
import ServerSection from "./ServerSection";
import ServerMember from "./ServerMember";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className=" mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className=" mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className=" mr-2 h-4 w-4" />,
};

const roleIconsMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className=" h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className=" h-4 w-4 mr-2 text-rose-500" />,
};

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
      <ServerHeader server={server} role={role} />

      <ScrollArea className=" flex-1 px-3">
        <div className=" mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  icon: roleIconsMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>

        <Separator className=" bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {!!textChannels?.length && (
          <div className=" mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Text Channel"
            />

            <div className=" space-y-2">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!audioChannels?.length && (
          <div className=" mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Channel"
            />

            <div className=" space-y-2">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!videoChannels?.length && (
          <div className=" mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Channel"
            />

            <div className=" space-y-2">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className=" mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />

            <div className=" space-y-2">
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;

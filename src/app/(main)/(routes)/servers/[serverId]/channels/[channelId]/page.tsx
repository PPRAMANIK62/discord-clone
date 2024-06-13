import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className=" bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />

      <div className=" flex-1">Future Messages</div>

      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
};

export default page;

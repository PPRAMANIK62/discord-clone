"use client";

import { useUser } from "@clerk/nextjs";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}

const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!isLoaded) return;
    if (user?.firstName || user?.lastName) return;
    console.log(user);
    console.log(user?.firstName);
    console.log(user?.lastName);

    const name = `${user?.firstName}_${user?.lastName}`;

    (async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await res.json();

        setToken(data.token);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId, isLoaded]);

  if (!isLoaded || token === "")
    return (
      <div className=" flex flex-col flex-1 justify-center items-center">
        <Loader2 className=" h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className=" text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );

  return (
    <LiveKitRoom
      data-lk-theme="default"
      style={{ height: "100dvh" }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <MyVideoConference />
      <RoomAudioRenderer />
      <ControlBar />
    </LiveKitRoom>
  );
};

export default MediaRoom;

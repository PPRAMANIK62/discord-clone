import InitialModal from "@/components/modals/InitialModal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initialProfile";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const profile = (await initialProfile()) as Profile;

  const server = await db.server.findFirst({
    where: {
      Members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <InitialModal />;
};

export default page;

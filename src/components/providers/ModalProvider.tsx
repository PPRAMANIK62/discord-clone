"use client";
import { useEffect, useState } from "react";
import CreateChannelModal from "../modals/CreateChannelModal";
import CreateServerModal from "../modals/CreateServerModal";
import DeleteChannelModal from "../modals/DeleteChannelModal";
import DeleteMessageModal from "../modals/DeleteMessageModal";
import DeleteServerModal from "../modals/DeleteServerModal";
import EditChannelModal from "../modals/EditChannelModal";
import EditServerModal from "../modals/EditServerModal";
import InviteModal from "../modals/InviteModal";
import LeaveServerModal from "../modals/LeaveServerModal";
import MembersModal from "../modals/MembersModal";
import MessageFileModal from "../modals/MessageFileModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};

export default ModalProvider;

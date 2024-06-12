"use client";

import { useModal } from "@/hooks/useModalStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const DeleteServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data, onOpen } = useModal();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onConfirm = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-white text-black p-0 overflow-hidden">
        <DialogHeader className=" pt-8 px-6">
          <DialogTitle className=" text-2xl text-center font-bold">
            Delete Server
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to do this? <br />{" "}
            <span className=" text-indigo-500 font-semibold">
              {server?.name}
            </span>{" "}
            will be permanently deleted
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className=" bg-gray-100 px-6 py-4">
          <div className=" flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant={"primary"}
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
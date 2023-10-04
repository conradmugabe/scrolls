"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/dialog";
import { Button } from "@/components/common/button";

export function UploadButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(v) => {
          if (!v) {
            setIsOpen(v);
          }
        }}
      >
        <DialogTrigger onClick={() => setIsOpen(true)} asChild>
          <Button>Upload PDF</Button>
        </DialogTrigger>
        <DialogContent>Hello</DialogContent>
      </Dialog>
    </>
  );
}

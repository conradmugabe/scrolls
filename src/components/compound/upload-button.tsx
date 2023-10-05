"use client";

import { useState } from "react";

import Dropzone from "react-dropzone";
import { Cloud } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/dialog";
import { Button } from "@/components/common/button";

function UploadDropzone() {
  return (
    <Dropzone
      multiple={false}
      onDrop={(acceptedFiles) => {
        console.log(acceptedFiles);
      }}
    >
      {({ acceptedFiles, getInputProps, getRootProps }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col justify-center items-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
              </div>
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
}

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
        <DialogContent>
          <UploadDropzone />
        </DialogContent>
      </Dialog>
    </>
  );
}

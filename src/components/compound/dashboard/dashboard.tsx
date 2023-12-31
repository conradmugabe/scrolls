"use client";

import { Suspense, useState } from "react";

import Skeleton from "react-loading-skeleton";

import { MaxWidthWrapper } from "@/components/common/max-width-wrapper";
import { UploadButton } from "@/components/compound/upload-button";
import { useToast } from "@/components/common/toast/use-toast";
import { trpc } from "@/app/_trpc/client";
import { Files } from "./files";

export function Dashboard() {
  const { toast } = useToast();
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const utils = trpc.useContext();
  const { data: files } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
      return toast({
        description: "Successfully deleted file",
        className: "text-green-600 bg-green-50",
      });
    },
    onMutate: ({ id }) => {
      setDeletingFile(id);
    },
    onSettled: () => {
      setDeletingFile(null);
    },
  });

  return (
    <MaxWidthWrapper>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900xl">My Files</h1>
        <UploadButton />
      </div>
      <Suspense fallback={<Skeleton count={3} height={100} className="my-2" />}>
        {files && (
          <Files
            files={files}
            deleteFile={deleteFile}
            deletingFile={deletingFile}
          />
        )}
      </Suspense>
    </MaxWidthWrapper>
  );
}

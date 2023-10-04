"use client";

import { Suspense } from "react";

import Skeleton from "react-loading-skeleton";

import { MaxWidthWrapper } from "@/components/common/max-width-wrapper";
import { UploadButton } from "@/components/compound/upload-button";
import { trpc } from "@/app/_trpc/client";
import { Files } from "./files";

export function Dashboard() {
  const { data: files } = trpc.getUserFiles.useQuery();

  return (
    <MaxWidthWrapper>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900xl">My Files</h1>
        <UploadButton />
      </div>
      <Suspense fallback={<Skeleton count={3} height={100} className="my-2" />}>
        {files && <Files files={files} />}
      </Suspense>
    </MaxWidthWrapper>
  );
}

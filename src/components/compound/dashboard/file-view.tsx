import Link from "next/link";

import { $Enums } from "@prisma/client";
import { format } from "date-fns";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";

import { Button } from "@/components/common/button";

export type IFile = {
  createdAt: string;
  id: string;
  name: string;
  key: string;
  userId: string;
  uploadStatus: $Enums.UploadStatus;
  url: string;
  updatedAt: string;
};

type Props = {
  deleteFile: ({ id }: { id: string }) => void;
  file: IFile;
  deletingFile: string;
};

export function FileView({ deleteFile, file, deletingFile }: Props) {
  return (
    <li
      key={file.id}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
    >
      <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium text-zinc-900">
                {file.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(file.createdAt), "MMM yyyy")}
        </div>
        <div>
          <MessageSquare className="h-4 w-4" />
        </div>
        <Button
          size="sm"
          className="w-full"
          variant="destructive"
          onClick={() => deleteFile({ id: file.id })}
        >
          {deletingFile === file.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

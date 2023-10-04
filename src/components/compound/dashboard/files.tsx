import { $Enums } from "@prisma/client";

import { NoFiles } from "./no-files";

type IFile = {
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
  files: IFile[];
};

export function Files({ files }: Props) {
  if (files.length === 0) return <NoFiles />;

  return (
    <ul className="mt-8 grid gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
      {files
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((file) => (
          <li
            key={file.id}
            className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
          ></li>
        ))}
    </ul>
  );
}

import { NoFiles } from "./no-files";
import { FileView, IFile } from "./file-view";

type Props = {
  deleteFile: ({ id }: { id: string }) => void;
  files: IFile[];
  deletingFile: string;
};

export function Files({ deleteFile, files, deletingFile }: Props) {
  if (files.length === 0) return <NoFiles />;

  return (
    <ul className="mt-8 grid gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
      {files
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((file) => (
          <FileView
            key={file.id}
            file={file}
            deleteFile={deleteFile}
            deletingFile={deletingFile}
          />
        ))}
    </ul>
  );
}

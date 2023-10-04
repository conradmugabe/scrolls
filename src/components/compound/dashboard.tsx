import { MaxWidthWrapper } from "@/components/common/max-width-wrapper";
import { UploadButton } from "./upload-button";

export function Dashboard() {
  return (
    <MaxWidthWrapper>
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900xl">My Files</h1>
        <UploadButton />
      </div>
    </MaxWidthWrapper>
  );
}

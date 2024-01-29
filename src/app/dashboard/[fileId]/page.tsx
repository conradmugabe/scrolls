import { notFound, redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { PDFRenderer } from "@/components/compound/pdf-view";
import { ChatWrapper } from "@/components/compound/chat-view";

type Props = {
  params: { fileId: string };
};

export default async function Page({ params: { fileId } }: Props) {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}}`);

  const file = await db.file.findFirst({
    where: { id: fileId, userId: user.id },
  });

  if (!file) notFound();

  const url = `https://utfs.io/f/${file.key}`;

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PDFRenderer url={url} />
          </div>
        </div>
        <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
          <ChatWrapper fileId={fileId} />
        </div>
      </div>
    </div>
  );
}

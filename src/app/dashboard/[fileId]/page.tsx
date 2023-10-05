import { notFound, redirect } from "next/navigation";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";

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

  return <div>{fileId}</div>;
}

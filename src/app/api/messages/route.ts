import { NextRequest, NextResponse } from "next/server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { db } from "@/db";

const schema = z.object({
  fileId: z.string(),
  message: z.string(),
});

export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id)
    return NextResponse.json("UNAUTHORIZED", { status: 401 });

  const body = await request.json();
  const parsedBody = schema.safeParse(body);
  if (!parsedBody.success)
    return NextResponse.json(parsedBody.error.format(), { status: 400 });

  const file = await db.file.findUnique({
    where: { id: parsedBody.data.fileId, userId: user.id },
  });
  if (!file) return NextResponse.json("NOT_FOUND", { status: 404 });

  await db.message.create({
    data: {
      isUserMessage: true,
      text: parsedBody.data.message,
      fileId: file.id,
      userId: user.id,
    },
  });
}

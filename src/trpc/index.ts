import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";

import { publicProcedure, router } from "./trpc";
import { db } from "@/db";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    console.log("user", user);

    if (!user?.id || !user?.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({ where: { id: user.id } });

    if (!dbUser) {
      await db.user.create({ data: { email: user.email, id: user.id } });
    }

    return { success: true };
  }),
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

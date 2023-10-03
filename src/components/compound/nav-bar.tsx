import Link from "next/link";

import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

import { MaxWidthWrapper } from "@/components/common/max-width-wrapper";
import { buttonVariants } from "@/components/common/button";
import { ArrowRight } from "lucide-react";

export function NavBar() {
  return (
    <header className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Scrolls</span>
          </Link>
          {/* todo: add mobile nav bar */}
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </LoginLink>
              <RegisterLink className={buttonVariants({ size: "sm" })}>
                Get started <ArrowRight className="ml-1.5 h-5 w-5" />
              </RegisterLink>
            </>
          </div>
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}

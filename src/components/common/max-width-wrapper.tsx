import { cn } from "@/utils/cn-utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function MaxWidthWrapper({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-xl px-2.5 md:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link
      href="/"
      className="focus-visible:ring-ring flex shrink-0 items-center gap-1 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      aria-label="WafiLife home"
    >
      <Image
        src="/brand_logos/wafilife-logo.svg"
        alt="WafiLife Logo"
        width={compact ? 120 : 160}
        height={compact ? 32 : 40}
        priority
        className={cn(
          "object-contain transition-all",
          compact ? "h-8 w-auto" : "h-10 w-auto sm:h-12",
        )}
      />
    </Link>
  );
}

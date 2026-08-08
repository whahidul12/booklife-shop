import Image from "next/image";
import Link from "next/link";
import type { Publisher } from "@/types";

interface PublisherCardProps {
  publisher: Publisher;
}

export function PublisherCard({ publisher }: PublisherCardProps) {
  return (
    <Link
      href={publisher.href || "#"}
      className="w-36 shrink-0 snap-start sm:w-40 md:w-44 lg:w-43"
    >
      <div className="flex flex-col rounded-md border border-gray-200/90 bg-white transition-all hover:border-gray-300 hover:shadow-xs">
        {/* Logo Box */}
        <div className="flex h-28 items-center justify-center p-3">
          <div className="relative h-14 w-full">
            <Image
              src={publisher.logo}
              alt={publisher.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Name Footer */}
        <div className="border-t border-gray-100 px-2 py-2.5 text-center">
          <p
            className="truncate text-xs text-gray-700 transition-colors hover:text-red-600 sm:text-[13px]"
            title={publisher.name}
          >
            {publisher.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

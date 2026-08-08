import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/types";

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link
      href={author.href || "#"}
      className="w-36 shrink-0 snap-start sm:w-40 md:w-44 lg:w-43"
    >
      <div className="flex flex-col rounded-md border border-gray-200/90 bg-white transition-all hover:border-gray-300 hover:shadow-xs">
        {/* Avatar Box */}
        <div className="flex h-28 items-center justify-center p-3">
          <div className="relative size-20 overflow-hidden rounded-full border border-gray-100 shadow-xs sm:size-22">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Name Footer */}
        <div className="border-t border-gray-100 px-2 py-2.5 text-center">
          <p
            className="truncate text-xs text-gray-700 transition-colors hover:text-red-600 sm:text-[13px]"
            title={author.name}
          >
            {author.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

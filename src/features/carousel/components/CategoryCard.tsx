import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CategoryItem } from "../constants/carousel.const";

interface CategoryCardProps {
  category: CategoryItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="border-border bg-card flex h-full flex-col rounded-lg border p-4 shadow-sm">
      <h2 className="text-card-foreground text-lg font-semibold">
        {category.title}
      </h2>
      <div className="my-4 grid grid-cols-2 gap-3">
        {/* Destructure the label, isbn, and imageSrc from each item tuple */}
        {category.items.map(([label, , imageSrc]) => (
          <Link
            key={label}
            href="/books/book-12"
            className="group/item border-border bg-secondary hover:border-brand flex min-w-0 flex-col items-center rounded-md border p-2 transition-colors"
          >
            <div className="bg-muted relative aspect-3/4 w-full max-w-28 overflow-hidden rounded-sm">
              <Image
                src={imageSrc}
                alt={`${label} বইয়ের প্রচ্ছদ`}
                fill
                className="object-cover transition-transform duration-300 group-hover/item:scale-105"
                sizes="(max-width: 640px) 38vw, (max-width: 1024px) 18vw, 120px"
              />
            </div>
            <span className="text-secondary-foreground mt-2 w-full truncate text-center text-sm font-medium">
              {label}
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="#"
        className="text-brand focus-visible:ring-ring mt-auto inline-flex min-h-10 items-center gap-1 text-sm font-semibold hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        সব দেখুন <ChevronRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

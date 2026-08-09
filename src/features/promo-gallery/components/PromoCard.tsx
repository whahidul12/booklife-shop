import Image from "next/image";
import Link from "next/link";

interface PromoCardProps {
  src: string;
  alt: string;
  link: string;
}

export function PromoCard({ src, alt, link }: PromoCardProps) {
  return (
    <Link
      href={link}
      className="group block overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-square w-full">
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
    </Link>
  );
}

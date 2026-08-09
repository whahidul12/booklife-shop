import Image from "next/image";

export function PlayStoreButton() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.wafilife.app"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block transition-transform hover:scale-105 active:scale-95"
    >
      {/* Using standard Google Play badge visual structure */}
      <Image
        src="/brand_logos/play-store.png"
        alt="Get it on Google Play"
        width={250}
        height={77}
        className="h-10 w-auto rounded-md md:h-15"
      />
    </a>
  );
}

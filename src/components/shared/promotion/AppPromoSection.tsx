import { AppPromoText } from "@/features/promo-app";
import Image from "next/image";

export function AppPromoSection() {
  return (
    <section className="relative flex min-h-100 w-full items-center overflow-hidden bg-[#f4f4f4]">
      <div className="mx-auto flex w-full max-w-360 flex-col items-center justify-center md:flex-row">
        {/* Left Side */}
        <div className="flex w-full justify-center md:w-1/2 md:justify-start">
          <AppPromoText />
        </div>

        {/* Right Side */}
        <div className="relative flex h-75 w-full justify-center md:h-125 md:w-1/2">
          <Image
            src="/book_cover_img/promo-app.png"
            alt="Wafilife Mobile App Interface"
            width={800}
            height={600}
            className="h-full w-full object-contain object-center md:object-left"
          />
        </div>
      </div>
    </section>
  );
}

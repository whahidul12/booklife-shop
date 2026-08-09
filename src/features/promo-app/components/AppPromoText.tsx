import { PlayStoreButton } from "./PlayStoreButton";

export function AppPromoText() {
  return (
    <div className="z-10 flex max-w-xl flex-col justify-center p-6 md:p-12 lg:pl-24">
      <h2 className="mb-4 text-2xl leading-tight font-bold text-[#2d3748] md:text-4xl lg:text-3xl">
        Make your online shop easier with our mobile app
      </h2>
      <p className="mb-6 text-base leading-relaxed text-gray-600 md:text-lg">
        Wafilife makes Islamic shopping easy—order authentic books, gifts, and
        lifestyle products delivered straight to your doorstep.
      </p>
      <div className="mt-2">
        <PlayStoreButton />
      </div>
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  ariaLabelPrev?: string;
  ariaLabelNext?: string;
  className?: string;
}

export function CarouselControls({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  ariaLabelPrev = "Previous",
  ariaLabelNext = "Next",
  className = "",
}: CarouselControlsProps) {
  return (
    <>
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={onScrollLeft}
          aria-label={ariaLabelPrev}
          className={`absolute top-1/2 -left-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-transform hover:scale-110 focus:outline-none ${className}`}
        >
          <ChevronLeft className="size-5" />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={onScrollRight}
          aria-label={ariaLabelNext}
          className={`absolute top-1/2 -right-3 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-transform hover:scale-110 focus:outline-none ${className}`}
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </>
  );
}

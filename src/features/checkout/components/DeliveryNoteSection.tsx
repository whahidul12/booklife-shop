import { cn } from "@/lib/utils";

interface DeliveryNoteSectionProps {
  note: string;
  isGiftWrapped: boolean;
  shipToDifferentAddress: boolean;
  onNoteChange: (val: string) => void;
  onGiftWrapChange: (val: boolean) => void;
  onShipDifferentChange: (val: boolean) => void;
}

export function DeliveryNoteSection({
  note,
  isGiftWrapped,
  shipToDifferentAddress,
  onNoteChange,
  onGiftWrapChange,
  onShipDifferentChange,
}: DeliveryNoteSectionProps) {
  return (
    <div className="mt-8 space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-600">ডেলিভারি নোট</label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="min-h-20 w-full resize-y rounded border border-gray-200 p-3 focus:border-red-400 focus:ring-1 focus:ring-red-400 focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isGiftWrapped}
            onChange={(e) => onGiftWrapChange(e.target.checked)}
            className={cn(
              "flex h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded border-2 outline-none",
              shipToDifferentAddress && isGiftWrapped
                ? "border-red-500 bg-white"
                : "border-gray-300 bg-white",
              "transition-all after:h-2.5 after:w-2.5 after:scale-0 after:rounded-sm after:bg-red-500 after:content-[''] checked:after:scale-100",
            )}
            style={{ WebkitAppearance: "none" }}
          />
          <span className="text-sm text-gray-700">
            ডেলিভারি পার্সেলটি কি গিফট পেপারে মুড়িয়ে পাঠাতে চান? অতিরিক্ত{" "}
            <span className="font-semibold">30</span> টাকা যুক্ত হবে।
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={shipToDifferentAddress}
            onChange={(e) => onShipDifferentChange(e.target.checked)}
            className={cn(
              "flex h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded border-2 outline-none",
              shipToDifferentAddress && isGiftWrapped
                ? "border-red-500 bg-white"
                : "border-gray-300 bg-white",
              "transition-all after:h-2.5 after:w-2.5 after:scale-0 after:rounded-sm after:bg-red-500 after:content-[''] checked:after:scale-100",
            )}
            style={{ WebkitAppearance: "none" }}
          />
          <span className="text-sm text-gray-700">
            পণ্য অন্য জায়গায় পাঠানোর ঠিকানা?
          </span>
        </label>
      </div>
    </div>
  );
}

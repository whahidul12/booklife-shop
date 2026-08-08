import { cn } from "@/lib/utils";
import Image from "next/image";

interface PaymentOptionCardProps {
  id: string;
  name: string;
  logoUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
  isFullWidth?: boolean;
}

export function PaymentOptionCard({
  id,
  name,
  logoUrl,
  isSelected,
  onSelect,
  isFullWidth,
}: PaymentOptionCardProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded border bg-white p-4 transition-all",
        isSelected ? "border-red-500" : "border-gray-200 hover:border-gray-300",
        isFullWidth ? "col-span-full" : "col-span-1",
      )}
    >
      <input
        type="checkbox"
        name="payment-method"
        value={id}
        checked={isSelected}
        onChange={onSelect}
        className={cn(
          "flex h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded border-2 outline-none",
          isSelected ? "border-red-500 bg-white" : "border-gray-300 bg-white",
          "transition-all after:h-2.5 after:w-2.5 after:scale-0 after:rounded-sm after:bg-red-500 after:content-[''] checked:after:scale-100",
        )}
        style={{ WebkitAppearance: "none" }}
      />
      <div className="flex flex-1 items-center justify-center gap-3">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={name}
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
          />
        ) : (
          <span className="text-sm font-medium text-gray-700">{name}</span>
        )}
      </div>
    </label>
  );
}

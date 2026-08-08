import { cn } from "@/lib/utils";
import { Pencil, X } from "lucide-react";

interface AddressCardProps {
  name: string;
  location: string;
  addressLine: string;
  phone: string;
  isActive: boolean;
  onClick: () => void;
}

export function AddressCard({
  name,
  location,
  addressLine,
  phone,
  isActive,
  onClick,
}: AddressCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative cursor-pointer rounded border bg-white p-4 transition-colors",
        isActive ? "border-red-500" : "border-gray-200 hover:border-red-300",
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-sm font-bold text-gray-900">{name}</h3>
        {isActive && (
          <div className="absolute top-3 right-3 flex gap-1">
            <button className="rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600">
              <Pencil className="h-3 w-3" />
            </button>
            <button className="rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <div className="space-y-1 text-xs text-gray-500">
        <p>{location}</p>
        <p>{addressLine}</p>
        <p>{phone}</p>
      </div>
    </div>
  );
}

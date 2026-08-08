import React from "react";
import { Trash2 } from "lucide-react";

interface CartHeaderProps {
  onClearAll: () => void;
  hasItems: boolean;
}

export const CartHeader: React.FC<CartHeaderProps> = ({
  onClearAll,
  hasItems,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
      <h1 className="text-xl font-bold text-gray-800">শপিং ব্যাগ</h1>
      {hasItems && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      )}
    </div>
  );
};

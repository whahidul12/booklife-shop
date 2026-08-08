"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface CheckoutButtonProps {
  disabled?: boolean;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  disabled = false,
}) => {
  if (disabled) {
    return (
      <button
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-md bg-gray-300 py-3 text-center text-sm font-semibold text-gray-500"
      >
        অর্ডার করতে এগিয়ে যান
      </button>
    );
  }

  return (
    <Link
      href="/checkout"
      className={cn(
        "mt-6 block w-full rounded-md bg-red-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-600",
      )}
    >
      অর্ডার করতে এগিয়ে যান
    </Link>
  );
};

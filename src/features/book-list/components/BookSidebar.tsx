import React from "react";
import { FilterAccordion } from "./FilterAccordion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface BookSidebarProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export const BookSidebar: React.FC<BookSidebarProps> = ({
  priceRange,
  setPriceRange,
}) => {
  return (
    <aside className="hidden w-64 shrink-0 flex-col space-y-6 lg:flex">
      {/* Price Range Filter */}
      <div className="rounded-md border border-gray-100 bg-white p-4">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">
          Price Range
        </h3>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          max={20000}
          step={100}
          onValueChange={(val) => {
            if (Array.isArray(val)) {
              setPriceRange([val[0], val[1]]);
            }
          }}
          className="mb-4"
        />
        <div className="flex items-center justify-between space-x-2">
          <Input
            type="number"
            value={priceRange[0]}
            readOnly
            className="h-8 text-center text-xs"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            value={priceRange[1]}
            readOnly
            className="h-8 text-center text-xs"
          />
        </div>
      </div>

      {/* Accordions */}
      <div className="rounded-md border border-gray-100 bg-white px-4">
        <FilterAccordion
          title="লেখক"
          value="authors"
          options={[
            { id: "1", label: "আরিফ আজাদ", count: 42 },
            { id: "2", label: "মাওলানা তারিক জামিল", count: 15 },
          ]}
          selectedIds={[]}
          onToggle={() => {}}
        />
        <FilterAccordion
          title="প্রকাশনী"
          value="publishers"
          options={[
            { id: "p1", label: "সমকালীন প্রকাশন", count: 120 },
            { id: "p2", label: "মাকতাবাতুল ইসলাম", count: 85 },
          ]}
          selectedIds={[]}
          onToggle={() => {}}
        />
      </div>
    </aside>
  );
};

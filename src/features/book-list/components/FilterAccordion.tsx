import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterAccordionProps {
  title: string;
  value: string;
  options: FilterOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const FilterAccordion: React.FC<FilterAccordionProps> = ({
  title,
  value,
  options,
  selectedIds,
  onToggle,
}) => {
  return (
    <Accordion
      defaultValue={[value]}
      className="w-full border-b border-gray-100"
    >
      <AccordionItem value={value} className="border-none">
        <AccordionTrigger className="py-3 text-sm font-semibold text-gray-700 hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-4">
          <div className="flex flex-col space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedIds.includes(option.id)}
                  onCheckedChange={() => onToggle(option.id)}
                  className="border-gray-300"
                />
                <label
                  htmlFor={option.id}
                  className="flex flex-1 cursor-pointer items-center justify-between text-sm text-gray-600"
                >
                  <span>{option.label}</span>
                  <span className="text-xs text-gray-400">
                    ({option.count})
                  </span>
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

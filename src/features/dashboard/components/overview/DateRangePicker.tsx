"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label?: string;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  compact?: boolean;
  align?: "left" | "right";
}

// Helpers
function formatShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFullDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(target: Date, start: Date, end: Date): boolean {
  const t = target.getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return t >= Math.min(s, e) && t <= Math.max(s, e);
}

// Get default Last Week range (7 days prior up to today)
export function getDefaultLastWeekRange(): DateRange {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  return {
    startDate: lastWeek,
    endDate: today,
    label: "Last 7 Days",
  };
}

const PRESETS = [
  {
    label: "Today",
    getValue: () => {
      const now = new Date();
      return { startDate: now, endDate: now, label: "Today" };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return { startDate: d, endDate: d, label: "Yesterday" };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => getDefaultLastWeekRange(),
  },
  {
    label: "Last 14 Days",
    getValue: () => {
      const today = new Date();
      const past = new Date();
      past.setDate(today.getDate() - 14);
      return { startDate: past, endDate: today, label: "Last 14 Days" };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const today = new Date();
      const past = new Date();
      past.setDate(today.getDate() - 30);
      return { startDate: past, endDate: today, label: "Last 30 Days" };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: start, endDate: now, label: "This Month" };
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: start, endDate: end, label: "Last Month" };
    },
  },
];

export function DateRangePicker({
  value,
  onChange,
  compact = false,
  align = "right",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    value || getDefaultLastWeekRange()
  );
  const [activePreset, setActivePreset] = useState<string>("Last 7 Days");

  // Temporary selection state inside modal
  const [tempStart, setTempStart] = useState<Date>(selectedRange.startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(selectedRange.endDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Month navigation for the calendar view
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(selectedRange.endDate.getFullYear(), selectedRange.endDate.getMonth(), 1)
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    if (value) {
      setSelectedRange(value);
      setTempStart(value.startDate);
      setTempEnd(value.endDate);
      if (value.label) setActivePreset(value.label);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    if (tempStart && tempEnd) {
      const start = tempStart <= tempEnd ? tempStart : tempEnd;
      const end = tempStart <= tempEnd ? tempEnd : tempStart;
      const newRange: DateRange = {
        startDate: start,
        endDate: end,
        label: activePreset || `${formatShortDate(start)} - ${formatShortDate(end)}`,
      };
      setSelectedRange(newRange);
      onChange?.(newRange);
      setIsOpen(false);
    }
  };

  const handlePresetSelect = (preset: (typeof PRESETS)[0]) => {
    const range = preset.getValue();
    setActivePreset(preset.label);
    setTempStart(range.startDate);
    setTempEnd(range.endDate);
    setViewMonth(new Date(range.endDate.getFullYear(), range.endDate.getMonth(), 1));
  };

  const handleDayClick = (day: Date) => {
    setActivePreset("Custom Range");
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(day);
      setTempEnd(null);
    } else {
      if (day < tempStart) {
        setTempEnd(tempStart);
        setTempStart(day);
      } else {
        setTempEnd(day);
      }
    }
  };

  // Build calendar matrix
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells: { date: Date; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month padding
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    calendarCells.push({
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    });
  }

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setTempStart(selectedRange.startDate);
          setTempEnd(selectedRange.endDate);
          setIsOpen(!isOpen);
        }}
        className={`group bg-slate-50 hover:bg-slate-100/90 active:bg-slate-200/80 border border-slate-200 rounded-xl font-semibold text-slate-700 flex items-center gap-2 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#D10A11]/30 ${
          compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        }`}
        aria-label="Select Date Range"
      >
        <CalendarIcon className="size-3.5 text-[#D10A11]" />
        <span className="truncate">
          {formatShortDate(selectedRange.startDate)} - {formatShortDate(selectedRange.endDate)}
        </span>
        <ChevronDown className="size-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white border border-slate-100 rounded-2xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] p-4 flex flex-col md:flex-row gap-4 w-[330px] md:w-[540px] animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Sidebar Presets */}
          <div className="w-full md:w-36 border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-3 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible shrink-0">
            <p className="hidden md:block text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1">
              Presets
            </p>
            {PRESETS.map((p) => {
              const isSelected = activePreset === p.label;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between whitespace-nowrap ${
                    isSelected
                      ? "bg-red-50 text-[#D10A11] font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span>{p.label}</span>
                  {isSelected && <Check className="size-3 text-[#D10A11]" />}
                </button>
              );
            })}
          </div>

          {/* Calendar Pane */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Month & Nav */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-slate-800">
                {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
                  }
                  className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
                  }
                  className="size-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  aria-label="Next Month"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 mb-1">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarCells.map(({ date, isCurrentMonth }, idx) => {
                const isStart = tempStart && isSameDay(date, tempStart);
                const isEnd = tempEnd && isSameDay(date, tempEnd);
                const isCurrentRange =
                  tempStart &&
                  (tempEnd
                    ? isBetween(date, tempStart, tempEnd)
                    : hoverDate && isBetween(date, tempStart, hoverDate));

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={!isCurrentMonth}
                    onClick={() => handleDayClick(date)}
                    onMouseEnter={() => !tempEnd && setHoverDate(date)}
                    className={`size-8 rounded-lg flex items-center justify-center text-xs transition-all relative ${
                      !isCurrentMonth
                        ? "text-slate-200 pointer-events-none"
                        : isStart || isEnd
                        ? "bg-[#D10A11] text-white font-bold shadow-sm z-10 rounded-lg"
                        : isCurrentRange
                        ? "bg-red-50 text-[#D10A11] font-semibold"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer Summary & Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 gap-2">
              <div className="text-[11px] text-slate-500 truncate">
                <span className="font-medium text-slate-700">
                  {tempStart ? formatFullDate(tempStart) : "Select start"}
                </span>
                {" — "}
                <span className="font-medium text-slate-700">
                  {tempEnd ? formatFullDate(tempEnd) : tempStart ? "Select end" : "Select range"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-3 py-1 text-xs font-semibold text-white bg-[#D10A11] hover:bg-[#b0080e] rounded-lg transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

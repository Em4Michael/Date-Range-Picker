// components/DatePicker.tsx
"use client";

import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DayPickerSingleProps, DayPickerRangeProps, DateRange } from "react-day-picker";

interface DateValue {
  startDate: string | null;
  endDate: string | null;
}

interface DatePickerProps {
  value: DateValue;
  onSelect: (range: DateValue) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
  inputPlaceholder?: string;
  theme?: "dark" | "light" | "custom";
  mode?: "single" | "range";
  customStyles?: {
    input?: string;
    calendar?: string;
    button?: string;
  };
}

export default function DatePicker({
  value,
  onSelect,
  isOpen,
  setIsOpen,
  minDate,
  maxDate,
  className = "",
  inputPlaceholder = "YYYY-MM-DD - YYYY-MM-DD",
  theme = "light",
  mode = "range",
  customStyles = {},
}: DatePickerProps) {
  const [inputValue, setInputValue] = useState("");
  const [internalRange, setInternalRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: value.startDate ? parse(value.startDate, "yyyy-MM-dd", new Date()) : undefined,
    to: value.endDate ? parse(value.endDate, "yyyy-MM-dd", new Date()) : undefined,
  });

  useEffect(() => {
    const newFrom = value.startDate ? parse(value.startDate, "yyyy-MM-dd", new Date()) : undefined;
    const newTo = value.endDate ? parse(value.endDate, "yyyy-MM-dd", new Date()) : undefined;
    setInternalRange({ from: newFrom, to: newTo });
    updateInputValue(newFrom, newTo);
  }, [value]);

  const updateInputValue = (from: Date | undefined, to: Date | undefined) => {
    if (mode === "single") {
      setInputValue(from ? format(from, "yyyy-MM-dd") : "");
    } else if (from && to) {
      setInputValue(`${format(from, "yyyy-MM-dd")} - ${format(to, "yyyy-MM-dd")}`);
    } else if (from) {
      setInputValue(`${format(from, "yyyy-MM-dd")} - `);
    } else if (to) {
      setInputValue(` - ${format(to, "yyyy-MM-dd")}`);
    } else {
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (mode === "single") {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
      const newDate = isValidDate ? value : null;
      setInternalRange({ from: newDate ? parse(newDate, "yyyy-MM-dd", new Date()) : undefined, to: undefined });
    } else {
      const [start, end] = value.split(" - ").map((date) => date?.trim());
      const isValidDate = (date: string) =>
        /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));

      const newStart = start && isValidDate(start) ? start : null;
      const newEnd = end && isValidDate(end) ? end : null;

      setInternalRange({
        from: newStart ? parse(newStart, "yyyy-MM-dd", new Date()) : undefined,
        to: newEnd ? parse(newEnd, "yyyy-MM-dd", new Date()) : undefined,
      });
    }
  };

  const handleCalendarSelect = (newRange: Date | DateRange | undefined) => {
    if (mode === "single" && newRange instanceof Date) {
      setInternalRange({ from: newRange, to: undefined });
      const newDate = newRange ? format(newRange, "yyyy-MM-dd") : null;
      updateInputValue(newRange, undefined);
      onSelect({ startDate: newDate, endDate: null });
    } else if (mode === "range" && newRange && "from" in newRange) {
      setInternalRange({ from: newRange.from, to: newRange.to });
      const newStart = newRange.from ? format(newRange.from, "yyyy-MM-dd") : null;
      const newEnd = newRange.to ? format(newRange.to, "yyyy-MM-dd") : null;
      updateInputValue(newRange.from, newRange.to);
      onSelect({ startDate: newStart, endDate: newEnd });
    }
  };

  const handleReset = () => {
    setInternalRange({ from: undefined, to: undefined });
    setInputValue("");
    onSelect({ startDate: null, endDate: null });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

const handleSend = () => {
    const start = internalRange.from ? format(internalRange.from, "yyyy-MM-dd") : null;
    const end = internalRange.to ? format(internalRange.to, "yyyy-MM-dd") : null;
    
    if (start && end) {
      const sentData = {
        fromDate: new Date(start).toISOString().split('T')[0],
        toDate: new Date(end).toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      console.log("Sent Data:", JSON.stringify(sentData, null, 2));
      setIsOpen(false);
    }
  };
  const baseStyles = {
    input: theme === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" :
           theme === "light" ? "bg-white border-gray-300 text-gray-900 placeholder-gray-500" : "",
    calendar: theme === "dark" ? "bg-gray-800 text-white border-none" :
              theme === "light" ? "bg-white text-gray-900 border-gray-200" : "",
    button: theme === "dark" ? "border-gray-600 text-gray-200 hover:bg-gray-700" :
            theme === "light" ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "",
    sendButton: theme === "dark" ? "bg-green-600 hover:bg-green-700 text-white" :
                theme === "light" ? "bg-green-500 hover:bg-green-600 text-white" : "",
  };


const calendarProps =
mode === "single"
  ? ({
      mode: "single",
      selected: internalRange.from,
      onSelect: handleCalendarSelect,
      fromDate: minDate ? parse(minDate, "yyyy-MM-dd", new Date()) : undefined,
      toDate: maxDate ? parse(maxDate, "yyyy-MM-dd", new Date()) : undefined,
      className: cn(
        "rounded-lg p-2 text-sm",
        "max-w-[250px] m-auto items-center justify-center"
      ),
      classNames: {
        months: "flex flex-col gap-2",
        month: "space-y-2",
        caption: "text-base font-semibold mb-1",
        nav_button: "h-6 w-6 bg-transparent hover:bg-green-100 text-current",
        head_cell: "text-gray-500 font-medium w-8 h-8 text-xs",
        cell: "w-8 h-8",
        day: cn(
          "w-8 h-8 flex items-center justify-center rounded-full text-sm",
          "hover:bg-green-100/50 transition-colors duration-200"
        ),
        day_selected: "bg-green-600 text-white rounded-full",
        day_range_start: "bg-green-600 text-white rounded-l-full",
        day_range_end: "bg-green-600 text-white rounded-r-full",
        day_range_middle: "bg-green-600 text-white",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-50",
      },
    } as DayPickerSingleProps)
  : ({
      mode: "range",
      selected: internalRange,
      onSelect: handleCalendarSelect,
      fromDate: minDate ? parse(minDate, "yyyy-MM-dd", new Date()) : undefined,
      toDate: maxDate ? parse(maxDate, "yyyy-MM-dd", new Date()) : undefined,
      className: cn(
        "rounded-lg p-2 text-sm",
        "max-w-[250px] m-auto items-center justify-center"
      ),
      classNames: {
        months: "flex flex-col gap-2",
        month: "space-y-2",
        caption: "text-base font-semibold mb-1",
        nav_button: "h-6 w-6 bg-transparent hover:bg-green-100 text-current",
        head_cell: "text-gray-500 font-medium w-8 h-8 text-xs",
        cell: "w-8 h-8",
        day: cn(
          "w-8 h-8 flex items-center justify-center rounded-full text-sm",
          "hover:bg-green-100/50 transition-colors duration-200"
        ),
        day_selected: "bg-green-600 text-white rounded-full",
        day_range_start: "bg-green-600 text-white rounded-l-full",
        day_range_end: "bg-green-600 text-white rounded-r-full",
        day_range_middle: "bg-green-600 text-white",
        day_outside: "text-gray-400 opacity-50",
        day_disabled: "text-gray-400 opacity-50",
      },
    } as DayPickerRangeProps);

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder={mode === "single" ? "YYYY-MM-DD" : inputPlaceholder}
              className={cn(
                baseStyles.input,
                "w-full max-w-[280px] focus:ring-2 focus:ring-green-500 transition-all duration-200 pr-10",
                customStyles.input
              )}
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-auto p-0 rounded-xl shadow-xl flex flex-col",
            baseStyles.calendar,
            customStyles.calendar
          )}
          align="start"
        >
          <div className="p-1 m-auto">
            <Calendar {...calendarProps} />
          </div>
          <div className="p-3 border-t flex justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className={cn(baseStyles.button, "text-sm py-1 h-8", customStyles.button)}
            >
              Reset
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className={cn(baseStyles.button, "text-sm py-1 h-8", customStyles.button)}
              >
                Close
              </Button>
              <Button
                onClick={handleSend}
                disabled={mode === "single" ? !internalRange.from : (!internalRange.from || !internalRange.to || (internalRange.from > internalRange.to!))}
                className={cn(baseStyles.sendButton, "text-sm py-1 h-8", customStyles.button)}
              >
                Send
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
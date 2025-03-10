"use client";

import { useState } from "react";
import DatePicker from "../components/DatePicker"; // Adjust path as needed
import { Button } from "@/components/ui/button";

export default function Revier() {

  const [dateRange, setDateRange] = useState({
    startDate: null as string | null,
    endDate: null as string | null,
  });

 
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelect = (range: { startDate: string | null; endDate: string | null }) => {
    setDateRange(range);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Another Page with Date Range Picker</h1>

      <DatePicker
        value={dateRange}
        onSelect={handleSelect}
        isOpen={isPickerOpen}
        setIsOpen={setIsPickerOpen}
        minDate="2024-01-01" 
        maxDate="2025-12-31" 
        className="mb-4"
        inputPlaceholder="Select your date range"
        theme="light"
        customStyles={{
          input: "border-blue-300 bg-white text-gray-800",
          calendar: "shadow-lg bg-white",
          button: "rounded-md",
        }}
      />

      {dateRange.startDate && dateRange.endDate ? (
        <p>
          Selected Range: {dateRange.startDate} - {dateRange.endDate}
        </p>
      ) : (
        <p>No range selected yet.</p>
      )}

      <Button onClick={() => setIsPickerOpen(true)} className="mt-4">
        Open Date Picker
      </Button>
    </div>
  );
}
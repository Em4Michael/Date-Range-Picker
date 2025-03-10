// app/page.tsx
"use client";

import { useState } from "react";
import DatePicker from "../components/DatePicker";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export default function HomePage() {
  const [dateRange, setDateRange] = useState({
    startDate: null as string | null,
    endDate: null as string | null,
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const sampleData = [
    { id: 1, date: "2025-02-01", value: "Event A", amount: 100 },
    { id: 2, date: "2025-03-15", value: "Event B", amount: 250 },
    { id: 3, date: "2025-04-20", value: "Event C", amount: 175 },
    { id: 4, date: "2025-05-10", value: "Event D", amount: 300 },
    { id: 5, date: "2025-06-30", value: "Event E", amount: 225 },
  ];

  const minDate = sampleData.reduce((min, curr) => 
    min < curr.date ? min : curr.date, sampleData[0].date);
  const maxDate = sampleData.reduce((max, curr) => 
    max > curr.date ? max : curr.date, sampleData[0].date);

  const handleSelect = (range: { startDate: string | null; endDate: string | null }) => {
    setDateRange(range);
  };

  const hasValidRange = dateRange.startDate && dateRange.endDate;

  const filteredData = hasValidRange
    ? sampleData.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(dateRange.startDate!);
        const end = new Date(dateRange.endDate!);
        return itemDate >= start && itemDate <= end;
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Date Range Selector
        </h1>

        <div className="mb-8">
          {!hasValidRange && !isDatePickerOpen ? (
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="group relative bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-300 rounded-lg p-3 flex items-center justify-center w-12 h-12"
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <CalendarIcon className="w-6 h-6 text-gray-600" />
            </button>
          ) : hasValidRange && !isDatePickerOpen ? (
            <Button
              onClick={() => setIsDatePickerOpen(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-300 rounded-lg px-6 py-3 w-full flex items-center justify-between"
            >
              <CalendarIcon className="w-6 h-6 text-gray-600" />
              <span>
                {dateRange.startDate} - {dateRange.endDate}
              </span>
            </Button>
          ) : (
            <div className="w-full">
              <DatePicker
                value={dateRange}
                onSelect={handleSelect}
                isOpen={isDatePickerOpen}
                setIsOpen={setIsDatePickerOpen}
                minDate={minDate}
                maxDate={maxDate}
                className="w-full"
                inputPlaceholder="Select date range"
                theme="light"
                mode="range"
                customStyles={{
                  input: "border-gray-300 bg-white text-gray-800",
                  calendar: "shadow-xl bg-white text-gray-800",
                  button: "rounded-lg",
                }}
              />
            </div>
          )}
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-300">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Value</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500 italic">
                    Select a date range to view data
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`border-t border-gray-300 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100`}
                  >
                    <td className="p-3 text-sm">{item.id}</td>
                    <td className="p-3 text-sm">{item.date}</td>
                    <td className="p-3 text-sm">{item.value}</td>
                    <td className="p-3 text-sm">${item.amount.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
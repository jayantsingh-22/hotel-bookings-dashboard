import React, { useState } from "react";
import "../style/DateSelector.css";

interface DateSelectorProps {
  onDateRangeSelect: (startDate: Date, endDate: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onDateRangeSelect }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date("06/30/2015"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("08/09/2015"));

  return (
    <div className="dateSelector">
      <h3>Date Selector</h3>
      <div className="startDate">
        <label>Start Date:  </label>
        <input data-testid="start-date"
          type="date"
          value={startDate ? startDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setStartDate(new Date(e.target.value))}
        />
      </div>
      <div className="endDate">
        <label>End Date:  </label>
        <input data-testid="end-date"
          type="date"
          value={endDate ? endDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setEndDate(new Date(e.target.value))}
        />
      </div>
      <div className="btn">
        <button data-testid="apply-btn"
          onClick={() => {
            if (startDate && endDate) {
              onDateRangeSelect(startDate, endDate);
            }
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateSelector;

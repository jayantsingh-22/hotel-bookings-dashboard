import React, { useState } from "react";
import DateSelector from "./components/DateSelector";
import LineChart from "./components/TimeSeriesChart";
import CountryColumnChart from "./components/CountryColumnChart";
import SparklineChart from "./components/SparklineChart";
import hotelBookingData from "./data/hotelBookingData";
import "./App.css";

const App: React.FC = () => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date("06/30/2015"));
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date("08/09/2015"));

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  // Filter data based on the selected date range
  const filteredData = hotelBookingData.filter((booking) => {
    if (selectedStartDate && selectedEndDate) {
      const bookingDate = new Date(
        booking.arrival_date_year,
        new Date(booking.arrival_date_month + " 1, 2000").getMonth(),
        booking.arrival_date_day_of_month
      );

      return bookingDate >= selectedStartDate && bookingDate <= selectedEndDate;
    }
    return false;
  });

  return (
    <div className="App">
      <h1>Hotel Booking Dashboard</h1>
      <DateSelector onDateRangeSelect={handleDateRangeSelect} />
      <LineChart data={filteredData} />
      <CountryColumnChart data={filteredData} />
      <SparklineChart data={filteredData} />
    </div>
  );
};

export default App;

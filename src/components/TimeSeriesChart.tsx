import React from "react";
import ReactApexChart from "react-apexcharts";
import "../style/LineChart.css";

interface LineChartProps {
  data: HotelBooking[]; // data is provided as a props
}

interface HotelBooking {
  arrival_date_year: number;
  arrival_date_month: string;
  arrival_date_day_of_month: number;
  adults: number;
  children: number;
  babies: number;
  country: string;
}

interface VisitorData {
  dates: string[];
  totalVisitors: number[];
  adults: number[];
  children: number[];
  babies: number[];
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  // Extract the necessary data from 'data' for the Time Series chart
  const visitorData: VisitorData = {
    dates: [],
    totalVisitors: [],
    adults: [],
    children: [],
    babies: [],
  };

  const set = new Set<string>();

  let startDate = "";
  let endDate = "";

  if (data.length > 0) {
    const sortedData = data.sort((a, b) => {
      // Create Date objects based on the date components
      const dateA = new Date(
        a.arrival_date_year,
        months.indexOf(a.arrival_date_month),
        a.arrival_date_day_of_month
      );
      const dateB = new Date(
        b.arrival_date_year,
        months.indexOf(b.arrival_date_month),
        b.arrival_date_day_of_month
      );

      // Compare dates
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });

    startDate = `${sortedData[0].arrival_date_year}-${sortedData[0].arrival_date_month}-${sortedData[0].arrival_date_day_of_month}`;
    endDate = `${sortedData[sortedData.length - 1].arrival_date_year}-${
      sortedData[sortedData.length - 1].arrival_date_month
    }-${sortedData[sortedData.length - 1].arrival_date_day_of_month}`;
  }

  data
    .filter((item) => {
      const itemDate = new Date(
        item.arrival_date_year,
        months.indexOf(item.arrival_date_month),
        item.arrival_date_day_of_month
      );

      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    })
    .forEach((item) => {
      const itemDateStr = `${item.arrival_date_year}-${item.arrival_date_month}-${item.arrival_date_day_of_month}`;

      set.add(itemDateStr);

      // Add the previous month's dates if startDate and endDate span different months
      const startDateDate = new Date(startDate);
      const endDateDate = new Date(endDate);

      if (startDateDate.getMonth() !== endDateDate.getMonth()) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + 1);

        while (currentDate.getMonth() !== endDateDate.getMonth()) {
          set.add(
            `${currentDate.getFullYear()}-${
              months[currentDate.getMonth()]
            }-${currentDate.getDate()}`
          );
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

  for (const element of set) {
    visitorData.dates.push(element);
  }

  // Total visitors calculation
  for (const element of visitorData.dates) {
    const visitorsPerDate = data
      .filter(
        (item) =>
          `${item.arrival_date_year}-${item.arrival_date_month}-${item.arrival_date_day_of_month}` ===
          element
      )
      .reduce((total, curr) => {
        return total + curr.adults + curr.children + curr.babies;
      }, 0);
    visitorData.totalVisitors.push(visitorsPerDate);
  }

  const series = [
    {
      name: "Visitors per day",
      data: [...visitorData.totalVisitors],
    },
  ];

  const options = {
    chart: {
      id: "visitors per day",
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [...visitorData.dates],
      labels: {
        style:{
          colors: "#FAEBD7"
        }
      }
    },
    yaxis: {
      title: {
        text: "Visitor_Count",
        style:{
          color: "#FFFFFF"
        }
      },
      labels:{
        style:{
          colors: "#FAEBD7"
        }
      }
    },
    colors: ["#34A0A4"],
    title: {
      text: `VISITORS PER DAY`,
      style: {
        fontSize: "20",
        color: "#FFFFFF"
      },
    },
  };

  return (
    <div className="line-chart" >
      <h2>Time Series Chart</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={255}
        width={600}
        data-testid="series-chart-header"
      />
    </div>
  );
};

export default LineChart;
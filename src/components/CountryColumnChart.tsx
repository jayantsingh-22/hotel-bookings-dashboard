import React from "react";
import ReactApexChart from "react-apexcharts";
import "../style/ColumnChart.css";

interface CountryColumnChartProps {
  data: HotelBooking[]; // You can define a proper data structure based on your API or data source
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

const CountryColumnChart: React.FC<CountryColumnChartProps> = ({ data }) => {
  // const startDate = ""; // Define your startDate
  // const endDate = ""; // Define your endDate

  const countryvisited: string[] = [];
  const visitorsPerCountry: number[] = [];

  // Collect unique countries
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

  const dateRange: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dateRange.push(
      `${currentDate.getFullYear()}-${
        months[currentDate.getMonth()]
      }-${currentDate.getDate()}`
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  data
    .filter((item) => {
      const itemDateStr = `${item.arrival_date_year}-${item.arrival_date_month}-${item.arrival_date_day_of_month}`;
      return dateRange.includes(itemDateStr);
    })
    .map((item) => set.add(item.country));

  for (const item of set) {
    countryvisited.push(item);
  }

  for (const element of countryvisited) {
    const ans = data
      .filter(
        (item) =>
          dateRange.includes(
            `${item.arrival_date_year}-${item.arrival_date_month}-${item.arrival_date_day_of_month}`
          ) && item.country === element
      )
      .reduce((sum, curr) => {
        return sum + curr.adults + curr.children + curr.babies;
      }, 0);
    visitorsPerCountry.push(ans);
  }

  return (
    <div className="ColumnChartContainer">
      <h2>Country Column Chart</h2>
      <ReactApexChart
        type="bar"
        series={[
          {
            name: "Visitors per country",
            data: [...visitorsPerCountry],
          },
        ]}
        options={{
          chart: {
            id: "visitors per country",
          },
          xaxis: {
            categories: [...countryvisited],
            labels:{
              style:{
                colors: "#FAEBD7"
              }
            },
            title: {
              text: "Countries",          
            },
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
            text: `VISITORS PER COUNTRY`,
            style: {
              fontSize: "20",
              color: "#FFFFFF",
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                position: "top",
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              colors: ["#E9967A"],
              fontSize: "12",
            },
          },
        }}
        height={255}
        width={600}
      />
    </div>
  );
};

export default CountryColumnChart;

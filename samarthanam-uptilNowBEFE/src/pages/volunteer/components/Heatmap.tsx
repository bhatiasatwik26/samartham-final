import React, { useEffect, useState } from "react";

// Define the activity interface
export interface HeatmapActivity {
  date: Date;
  count: number;
}

// Helper function to determine color intensity based on count
const getColorIntensity = (count: number) => {
  if (count === 0) return "bg-gray-100 dark:bg-gray-800";
  if (count === 1) return "bg-green-200 dark:bg-green-900/30";
  if (count === 2) return "bg-green-300 dark:bg-green-700/60";
  if (count === 3) return "bg-green-400 dark:bg-green-600";
  return "bg-green-500 dark:bg-green-500";
};

// Generate month labels for the past year
const generateMonths = () => {
  const months = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() - 11 + i);
    months.push(date.toLocaleString("default", { month: "short" }));
  }
  return months;
};

// Function to process API data into a heatmap grid
const processHeatmapData = (data: HeatmapActivity[]) => {
  const grid: HeatmapActivity[][] = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => ({ date: "", count: 0 }))
  );

  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 52 * 7); // Go back 52 weeks

  data.forEach((item) => {
    const date = new Date(item.date);

    // Skip dates outside the past year
    if (date < startDate || date > now) return;

    // Calculate grid position
    const diffDays = Math.floor(
      (date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const weekIndex = Math.floor(diffDays / 7);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Map Sunday to index 6

    if (weekIndex >= 0 && weekIndex < 52 && dayIndex >= 0 && dayIndex < 7) {
      grid[weekIndex][dayIndex] = {
        date: item.date,
        count: item.count,
      };
    }
  });

  return grid;
};

interface HeatmapProps {
  data: HeatmapActivity[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const [heatmapGrid, setHeatmapGrid] = useState<HeatmapActivity[][]>([]);

  useEffect(() => {
    const processedData = processHeatmapData(data);
    setHeatmapGrid(processedData);
  }, [data]);

  const monthLabels = generateMonths();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Your Activity (Past 52 Weeks)
        </h4>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800"></div>
            <div className="w-4 h-4 bg-green-200 dark:bg-green-900/30"></div>
            <div className="w-4 h-4 bg-green-300 dark:bg-green-700/60"></div>
            <div className="w-4 h-4 bg-green-400 dark:bg-green-600"></div>
            <div className="w-4 h-4 bg-green-500 dark:bg-green-500"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: "900px" }}>
          {/* Month labels */}
          <div className="flex mb-2">
            {monthLabels.map((month, index) => (
              <div
                key={index}
                className="flex-1 text-xs text-gray-600 dark:text-gray-400"
              >
                {month}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex">
            {/* Days of the week */}
            <div className="flex flex-col mr-2">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-500 dark:text-gray-400 h-[15px] flex items-center justify-end pr-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Activity cells */}
            <div className="flex flex-1 space-x-[3px]">
              {heatmapGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[15px] h-[15px] rounded-sm ${getColorIntensity(
                        day.count
                      )}`}
                      title={
                        day.date
                          ? `${day.date}: ${day.count} activities`
                          : "No activity"
                      }
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;

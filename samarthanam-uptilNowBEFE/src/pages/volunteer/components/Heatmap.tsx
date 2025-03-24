import React, { useEffect, useState } from "react";
import { ActivityDay } from "@/types/activity";
import { fetchUserActivity } from "@/services/activityApi";

// Define days for the heatmap (kept for data processing purposes)
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface HeatmapProps {
  data?: ActivityDay[];
  userId?: string;
}

export const Heatmap: React.FC<HeatmapProps> = ({ data: propData, userId }) => {
  const [activityData, setActivityData] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to determine the color intensity based on count
  const getColorIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-green-200 dark:bg-green-900/30';
    if (count === 2) return 'bg-green-300 dark:bg-green-700/60';
    if (count === 3) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };

  // Generate month labels
  const generateMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - 11 + i);
      months.push(MONTHS[date.getMonth()]);
    }
    return months;
  };

  // Parse API data and convert it to heatmap format
  const processApiData = (apiData: ActivityDay[]) => {
    // Initialize an empty 52x7 grid (52 weeks x 7 days) with count 0
    const grid = Array.from({ length: 52 }, () => 
      Array.from({ length: 7 }, () => ({
        count: 0,
        date: ''
      }))
    );
    
    // Calculate the start date (52 weeks ago)
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (52 * 7));
    
    // Populate the grid with API data
    apiData.forEach(item => {
      const date = new Date(item.date);
      
      // Skip dates outside our 52-week window
      if (date < startDate || date > now) return;
      
      // Calculate position in the grid
      const diffDays = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
      const weekIndex = Math.floor(diffDays / 7);
      const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert Sunday(0) to 6, Monday(1) to 0, etc.
      
      if (weekIndex >= 0 && weekIndex < 52 && dayIndex >= 0 && dayIndex < 7) {
        grid[weekIndex][dayIndex] = {
          count: item.count,
          date: item.date
        };
      }
    });
    
    return grid;
  };

  // Fetch activity data from the API
  const fetchActivityData = async () => {
    if (!userId) {
      setActivityData([]); // Reset data if no user ID
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the API service function to fetch data
      const apiData = propData || await fetchUserActivity(userId);
      
      // Process the data for the heatmap
      const processedData = processApiData(apiData);
      setActivityData(processedData);
    } catch (err) {
      console.error('Error fetching activity data:', err);
      setError('Failed to load activity data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If explicit data is provided via props, process it
    if (propData) {
      const processedData = processApiData(propData);
      setActivityData(processedData);
    } else if (userId) {
      // Otherwise fetch data if we have a user ID
      fetchActivityData();
    }
  }, [propData, userId]);

  const monthLabels = generateMonths();
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex flex-col justify-center items-center h-40 text-gray-600 dark:text-gray-400">
          <p>{error}</p>
          <button 
            onClick={fetchActivityData}
            className="mt-4 px-4 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your activity (past 52 weeks)</h4>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-2">Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900/30 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 dark:bg-green-700/60 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 dark:bg-green-500 rounded-sm"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: "900px" }}>
          {/* Month labels row */}
          <div className="flex mb-2">
            {monthLabels.map((month, i) => (
              <div key={i} className="flex-1 text-xs text-gray-600 dark:text-gray-400">{month}</div>
            ))}
          </div>
          
          {/* Activity grid without day labels */}
          <div className="flex">
            {/* Activity cells */}
            <div className="flex flex-1 space-x-[3px]">
              {activityData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[15px] h-[15px] rounded-sm ${getColorIntensity(day.count)}`}
                      title={day.date ? `${day.date}: ${day.count} contributions` : 'No activity'}
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
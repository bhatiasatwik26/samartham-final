import { ActivityDay } from "@/types/activity";

/**
 * Fetches user activity data for the heatmap calendar
 * @param userId - The ID of the user to fetch activity for
 * @param startDate - Optional start date (defaults to 52 weeks ago)
 * @param endDate - Optional end date (defaults to today)
 * @returns Promise with activity data array
 */
export const fetchUserActivity = async (
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<ActivityDay[]> => {
  try {
    // Calculate default dates if not provided
    if (!startDate) {
      const start = new Date();
      start.setDate(start.getDate() - (52 * 7)); // 52 weeks ago
      startDate = start.toISOString().split('T')[0];
    }

    if (!endDate) {
      endDate = new Date().toISOString().split('T')[0];
    }

    // INTEGRATION POINT: Replace with actual API call when backend is ready
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/activity?startDate=${startDate}&endDate=${endDate}`
    // );
    // 
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch activity data: ${response.statusText}`);
    // }
    // 
    // return await response.json();

    // For development, return dummy data
    return generateDummyActivityData(startDate, endDate);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    throw error;
  }
};

/**
 * Updates user activity data for a specific date
 * This would be called when a user completes a task or attends an event
 * @param userId - The ID of the user
 * @param date - The date to update (YYYY-MM-DD)
 * @param increment - Whether to increment (true) or decrement (false) the activity count
 * @returns Promise with the updated activity data
 */
export const updateUserActivity = async (
  userId: string,
  date: string,
  increment = true
): Promise<ActivityDay> => {
  try {
    // INTEGRATION POINT: Replace with actual API call when backend is ready
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/activity/${date}`,
    //   {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ increment }),
    //   }
    // );
    // 
    // if (!response.ok) {
    //   throw new Error(`Failed to update activity data: ${response.statusText}`);
    // }
    // 
    // return await response.json();

    // For development, return a dummy response
    return {
      date,
      count: increment ? Math.min(4, Math.floor(Math.random() * 4) + 1) : Math.max(0, Math.floor(Math.random() * 3))
    };
  } catch (error) {
    console.error("Error updating user activity:", error);
    throw error;
  }
};

/**
 * Generates dummy activity data for development
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns Array of activity day objects
 */
const generateDummyActivityData = (startDate: string, endDate: string): ActivityDay[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: ActivityDay[] = [];

  // Loop through each day in the date range
  const current = new Date(start);
  while (current <= end) {
    // Add activity for about 60% of days
    if (Math.random() > 0.4) {
      result.push({
        date: current.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5) // Random activity level 0-4
      });
    }
    
    // Move to next day
    current.setDate(current.getDate() + 1);
  }

  return result;
}; 
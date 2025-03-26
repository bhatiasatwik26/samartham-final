interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  streakHistory: { date: string; count: number }[];
}

// Function to fetch a user's streak data from the backend
export const fetchUserStreak = async (userId: string): Promise<StreakData> => {
  try {
    // INTEGRATION POINT: Replace with actual API call when backend is ready
    // const response = await fetch(`https://api.example.com/users/${userId}/streak`);
    // if (!response.ok) throw new Error("Failed to fetch streak data");
    // return await response.json();
    
    // For now, return mock data
    console.log(`Fetching streak data for user ${userId}`);
    return {
      currentStreak: 12,
      longestStreak: 15,
      lastLoginDate: new Date().toISOString().split('T')[0],
      streakHistory: [
        { date: new Date().toISOString().split('T')[0], count: 12 }
      ]
    };
  } catch (error) {
    console.error("Error fetching streak data:", error);
    // Return default values if there's an error
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: "",
      streakHistory: []
    };
  }
};

// Function to update a user's streak when they log in
export const updateLoginStreak = async (userId: string): Promise<StreakData> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // INTEGRATION POINT: Replace with actual API call when backend is ready
    // const response = await fetch(`https://api.example.com/users/${userId}/streak`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ loginDate: today })
    // });
    // if (!response.ok) throw new Error("Failed to update streak");
    // return await response.json();
    
    // For now, simulate a successful update
    console.log(`Updating streak for user ${userId} on ${today}`);
    return await fetchUserStreak(userId);
  } catch (error) {
    console.error("Error updating streak:", error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoginDate: "",
      streakHistory: []
    };
  }
}; 
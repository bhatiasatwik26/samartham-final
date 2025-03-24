import React, { useState, useEffect } from "react";
import { Flame, Award, Calendar, Clock } from "lucide-react";
import { fetchUserStreak } from "@/services/streakService";

interface StreakDisplayProps {
  userId: string;
  compact?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ userId, compact = false }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: "",
    streakHistory: [] as { date: string; count: number }[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const data = await fetchUserStreak(userId);
          setStreakData(data);
        } catch (error) {
          console.error("Failed to fetch streak data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchStreak();
  }, [userId]);

  // For compact display (used in badges section)
  if (compact) {
    return (
      <div className="flex items-center bg-orange-50 dark:bg-orange-900/10 px-4 py-2 rounded-full border border-orange-100 dark:border-orange-900/30">
        <Flame className="h-5 w-5 text-orange-500 mr-2" />
        {isLoading ? (
          <span className="text-sm font-semibold text-gray-800 dark:text-white">Loading streak...</span>
        ) : (
          <span className="text-sm font-semibold text-gray-800 dark:text-white">{streakData.currentStreak} Day Streak</span>
        )}
      </div>
    );
  }

  // Full display for detailed view
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/5 rounded-2xl border border-orange-200 dark:border-orange-900/20 p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <Flame className="h-6 w-6 text-orange-500 mr-2" />
        Login Streak
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500 mb-1">{streakData.currentStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500 mb-1">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500 mb-1">
              {streakData.lastLoginDate ? new Date(streakData.lastLoginDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Last Login</div>
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Log in daily to maintain your streak and earn special badges!</span>
      </div>
    </div>
  );
}; 
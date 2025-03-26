import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboardData } from "@/hooks/useLeaderboard";
import { Leaderboards } from "@/types/user";

interface LeaderboardProps {
  currentUserName?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUserName,
}: LeaderboardProps) => {
  const {
    data: leaderboardData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["leaderboardData"],
    queryFn: fetchLeaderboardData,
    select: (data) => data || [],
  });

  const maxPoints =
    leaderboardData.length > 0
      ? Math.max(...leaderboardData.map((person) => person.score))
      : 0;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Leaderboard
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            Top Volunteers
          </span>
        </div>
        <div className="flex justify-center py-8">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Leaderboard
          </h3>
        </div>
        <div className="text-center py-4 text-red-500 dark:text-red-400">
          <p>Failed to load leaderboard data. Please try again.</p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Leaderboard
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          Top Volunteers
        </span>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((person) => (
          <div
            key={person.name + person.position}
            className={`flex   ${
              person.name === currentUserName
                ? "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                : "border border-transparent"
            } items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 
            ${
              person.position === 1
                ? "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                : "border border-transparent"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full mr-3 
              ${
                person.position === 1
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border-2 border-yellow-400"
                  : person.position === 2
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-2 border-gray-400"
                  : person.position === 3
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 border-2 border-amber-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
              } 
              font-bold text-sm`}
            >
              {person.position}
            </div>

            <div className="flex-grow mr-4">
              <p
                className={`font-medium ${
                  person.name === currentUserName
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                {person.name}
              </p>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                <div
                  className={`h-1.5 rounded-full ${
                    person.position === 1
                      ? "bg-yellow-500"
                      : person.position === 2
                      ? "bg-gray-500"
                      : person.position === 3
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                  style={{
                    width: maxPoints
                      ? `${(person.score / maxPoints) * 100}%`
                      : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div className="text-gray-600 dark:text-gray-400 font-medium flex flex-col items-end">
              <span className="text-lg">{person.score}</span>
              <span className="text-xs text-gray-500">points</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          to="/leaderboard"
          className="w-full flex items-center justify-center text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-900/30 rounded-lg py-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <span>View Full Leaderboard</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

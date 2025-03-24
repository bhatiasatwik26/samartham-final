import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Define Volunteer interface
interface Volunteer {
  id: string;
  name: string;
  points: number;
  rank: number;
}

interface LeaderboardProps {
  currentUserId?: string; // Optional: to highlight the current user
  isLoading?: boolean;
  error?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  currentUserId,
  isLoading = false,
  error = null
}) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(isLoading);
  const [errorMsg, setErrorMsg] = useState<string | null>(error);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch data from API
        // const response = await fetch('/api/leaderboard');
        // const data = await response.json();
        
        // For now, use mock data
        const mockData: Volunteer[] = [
          { id: "001", name: "Sarah Johnson", points: 980, rank: 1 },
          { id: "002", name: "John Doe", points: 850, rank: 2 },
          { id: "003", name: "Michael Chen", points: 780, rank: 3 },
          { id: "004", name: "Emma Williams", points: 720, rank: 4 },
          { id: "005", name: "David Lee", points: 650, rank: 5 },
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setVolunteers(mockData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setErrorMsg("Failed to fetch leaderboard data");
        setLoading(false);
        console.error("Error fetching leaderboard data:", err);
      }
    };

    fetchLeaderboardData();
  }, []);
  
  // Find the highest score for percentage calculations
  const maxPoints = volunteers.length > 0 
    ? Math.max(...volunteers.map(vol => vol.points)) 
    : 0;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboard</h3>
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

  if (errorMsg) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboard</h3>
        </div>
        <div className="text-center py-4 text-red-500 dark:text-red-400">
          <p>{errorMsg}</p>
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
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboard</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          Top Volunteers
        </span>
      </div>
      
      <div className="space-y-3">
        {volunteers.map((person) => (
          <div 
            key={person.id} 
            className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 
            ${person.id === currentUserId ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30' : 'border border-transparent'}`}
          >
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full mr-3 
              ${person.rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border-2 border-yellow-400' : 
                person.rank === 2 ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-2 border-gray-400' : 
                person.rank === 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 border-2 border-amber-400' : 
                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'} 
              font-bold text-sm`}
            >
              {person.rank}
            </div>
            
            <div className="flex-grow mr-4">
              <p className={`font-medium ${person.id === currentUserId ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                {person.name}
              </p>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                <div 
                  className={`h-1.5 rounded-full ${
                    person.rank === 1 ? 'bg-yellow-500' : 
                    person.rank === 2 ? 'bg-gray-500' : 
                    person.rank === 3 ? 'bg-amber-500' : 
                    'bg-blue-500'}`
                  } 
                  style={{ width: `${(person.points / maxPoints) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-gray-600 dark:text-gray-400 font-medium flex flex-col items-end">
              <span className="text-lg">{person.points}</span>
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
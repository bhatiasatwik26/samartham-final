import React, { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, Medal, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Volunteer {
  id: string;
  name: string;
  points: number;
  rank: number;
  eventsParticipated: number;
  hoursVolunteered: number;
  joinedDate: string;
  achievement?: string;
}

const LeaderboardPage = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("002"); // Mock current user
  
  // Stats for sidebar
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    totalHours: 0,
    totalEvents: 0,
    mostActiveVolunteer: ""
  });

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, fetch data from API
        // const response = await fetch('/api/leaderboard/full');
        // const data = await response.json();
        
        // For now, use mock data
        const mockData: Volunteer[] = [
          { 
            id: "001", 
            name: "Sarah Johnson", 
            points: 980, 
            rank: 1, 
            eventsParticipated: 25, 
            hoursVolunteered: 120, 
            joinedDate: "2023-01-15",
            achievement: "Most Events" 
          },
          { 
            id: "002", 
            name: "John Doe", 
            points: 850, 
            rank: 2, 
            eventsParticipated: 20, 
            hoursVolunteered: 95, 
            joinedDate: "2023-02-10" 
          },
          { 
            id: "003", 
            name: "Michael Chen", 
            points: 780, 
            rank: 3, 
            eventsParticipated: 18, 
            hoursVolunteered: 85, 
            joinedDate: "2023-03-22" 
          },
          { 
            id: "004", 
            name: "Emma Williams", 
            points: 720, 
            rank: 4, 
            eventsParticipated: 15, 
            hoursVolunteered: 75, 
            joinedDate: "2023-01-30",
            achievement: "Rising Star" 
          },
          { 
            id: "005", 
            name: "David Lee", 
            points: 650, 
            rank: 5, 
            eventsParticipated: 12, 
            hoursVolunteered: 65, 
            joinedDate: "2023-04-05" 
          },
          { 
            id: "006", 
            name: "Lisa Miller", 
            points: 620, 
            rank: 6, 
            eventsParticipated: 14, 
            hoursVolunteered: 70, 
            joinedDate: "2023-02-18" 
          },
          { 
            id: "007", 
            name: "Robert Kim", 
            points: 580, 
            rank: 7, 
            eventsParticipated: 10, 
            hoursVolunteered: 62, 
            joinedDate: "2023-05-12" 
          },
          { 
            id: "008", 
            name: "Jessica Huang", 
            points: 540, 
            rank: 8, 
            eventsParticipated: 12, 
            hoursVolunteered: 58, 
            joinedDate: "2023-03-15",
            achievement: "Most Hours" 
          },
          { 
            id: "009", 
            name: "James Wilson", 
            points: 510, 
            rank: 9, 
            eventsParticipated: 9, 
            hoursVolunteered: 55, 
            joinedDate: "2023-06-01" 
          },
          { 
            id: "010", 
            name: "Sophie Garcia", 
            points: 495, 
            rank: 10, 
            eventsParticipated: 8, 
            hoursVolunteered: 50, 
            joinedDate: "2023-04-22" 
          },
          { 
            id: "011", 
            name: "Alexander Martinez", 
            points: 480, 
            rank: 11, 
            eventsParticipated: 11, 
            hoursVolunteered: 48, 
            joinedDate: "2023-07-05" 
          },
          { 
            id: "012", 
            name: "Olivia Brown", 
            points: 460, 
            rank: 12, 
            eventsParticipated: 7, 
            hoursVolunteered: 42, 
            joinedDate: "2023-03-28" 
          },
        ];
        
        // Calculate sidebar stats
        const totalVols = mockData.length;
        const totalHrs = mockData.reduce((acc, vol) => acc + vol.hoursVolunteered, 0);
        const totalEvts = mockData.reduce((acc, vol) => acc + vol.eventsParticipated, 0);
        const mostActive = mockData.sort((a, b) => b.hoursVolunteered - a.hoursVolunteered)[0].name;
        
        setStats({
          totalVolunteers: totalVols,
          totalHours: totalHrs,
          totalEvents: totalEvts,
          mostActiveVolunteer: mostActive
        });
        
        // Sort by rank
        const sortedData = mockData.sort((a, b) => a.rank - b.rank);
        
        // Simulate API delay
        setTimeout(() => {
          setVolunteers(sortedData);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to fetch leaderboard data");
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-32 md:pt-36">
        <div className="mb-6">
          <Link 
            to="/volunteer-dashboard" 
            className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Volunteer Leaderboard
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Main leaderboard */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-4 text-red-500 dark:text-red-400">
                    <p>{error}</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rank
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Volunteer
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Points
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                          Events
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                          Hours
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {volunteers.map((volunteer) => (
                        <tr 
                          key={volunteer.id}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            volunteer.id === currentUserId ? 'bg-red-50 dark:bg-red-900/10' : ''
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`
                              flex items-center justify-center w-8 h-8 rounded-full 
                              ${volunteer.rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border border-yellow-400' : 
                                volunteer.rank === 2 ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-400' : 
                                volunteer.rank === 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 border border-amber-400' : 
                                'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'} 
                              font-bold text-sm`}
                            >
                              {volunteer.rank}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className={`text-sm font-medium ${
                                  volunteer.id === currentUserId ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {volunteer.name}
                                </div>
                                {volunteer.achievement && (
                                  <div className="text-xs mt-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-0.5 px-2 rounded-full inline-flex items-center">
                                    <Award className="h-3 w-3 mr-1" />
                                    {volunteer.achievement}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white font-medium">{volunteer.points}</div>
                            <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  volunteer.rank === 1 ? 'bg-yellow-500' : 
                                  volunteer.rank === 2 ? 'bg-gray-500' : 
                                  volunteer.rank === 3 ? 'bg-amber-500' : 
                                  'bg-blue-500'}`
                                } 
                                style={{ width: `${(volunteer.points / maxPoints) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900 dark:text-white">{volunteer.eventsParticipated}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900 dark:text-white">{volunteer.hoursVolunteered}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                            {new Date(volunteer.joinedDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar stats */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Community Stats</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mr-4">
                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalVolunteers}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Volunteers</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mr-4">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalHours.toLocaleString()}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Hours</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mr-4">
                    <Medal className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalEvents}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Events</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Most Active Volunteer</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium text-gray-800 dark:text-white">{stats.mostActiveVolunteer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LeaderboardPage; 
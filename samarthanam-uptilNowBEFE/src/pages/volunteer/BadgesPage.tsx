import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AllBadges } from "@/pages/volunteer/components/Achievements";
import { ArrowLeft } from "lucide-react";

const BadgesPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the user data from an API
    const fetchUser = async () => {
      try {
        // Mock user data for now
        const mockUser = {
          id: "001",
          name: "John Doe",
          email: "john.doe@example.com",
          rank: "gold"
        };
        
        setUser(mockUser);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AllBadges user={user} />
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Badges</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Badges</span>
                  <span className="font-bold text-gray-800 dark:text-white">14</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Earned</span>
                  <span className="font-bold text-gray-800 dark:text-white">7</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                  <span className="font-bold text-gray-800 dark:text-white">7</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Most Recent Badge</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium text-gray-800 dark:text-white">50 Days Badge 2025</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Earned on Apr 15, 2025</p>
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

export default BadgesPage; 
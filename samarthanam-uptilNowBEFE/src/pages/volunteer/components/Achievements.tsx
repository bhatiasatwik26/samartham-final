import React, { useState, useEffect } from "react";
import { Flame, Sword, Sparkles, Shield, HeartHandshake, Users, ChevronRight, Award, Clock, Trophy, Star, Medal } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchUserStreak } from "@/services/streakService";
import { StreakDisplay } from "./StreakDisplay";

// Define badge interface for better type safety
interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  earned: boolean;
  date?: string; // Date when badge was earned (if earned)
}

interface AchievementBadgesProps {
  user: any;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({ user }) => {
  // Mock badges data - would come from backend in real app
  const badges: Badge[] = [
    {
      id: "guardian-angel",
      name: "Guardian Angel",
      icon: <HeartHandshake className="h-8 w-8 text-purple-600 dark:text-purple-500" />,
      color: "purple",
      description: "Supported 5+ events with critical needs",
      earned: true,
      date: "2023-11-15"
    },
    {
      id: "compassion-warrior",
      name: "Compassion Warrior",
      icon: <Sword className="h-8 w-8 text-red-600 dark:text-red-500" />,
      color: "red",
      description: "Completed 10+ tasks under tight deadlines",
      earned: true,
      date: "2023-12-03"
    },
    {
      id: "hope-bearer",
      name: "Hope Bearer",
      icon: <Sparkles className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      color: "yellow",
      description: "Participated in 3+ community support events",
      earned: true,
      date: "2024-01-20"
    },
    {
      id: "kindness-sentinel",
      name: "Kindness Sentinel",
      icon: <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
      color: "blue",
      description: "Helped protect vulnerable community members",
      earned: true,
      date: "2024-02-10"
    },
    {
      id: "inclusion-champion",
      name: "Inclusion Champion",
      icon: <Users className="h-8 w-8 text-green-600 dark:text-green-500" />,
      color: "green", 
      description: "Promoted diversity and inclusion at 3+ events",
      earned: true,
      date: "2024-03-05"
    },
    {
      id: "endurance-award",
      name: "Endurance Award",
      icon: <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />,
      color: "indigo",
      description: "Volunteered for 50+ hours total",
      earned: false
    },
    {
      id: "first-timer",
      name: "First Timer",
      icon: <Star className="h-8 w-8 text-amber-600 dark:text-amber-500" />,
      color: "amber",
      description: "Completed your first volunteer event",
      earned: true,
      date: "2023-10-05"
    },
    {
      id: "leadership",
      name: "Leadership",
      icon: <Trophy className="h-8 w-8 text-orange-600 dark:text-orange-500" />,
      color: "orange",
      description: "Led a volunteer team at an event",
      earned: false
    },
    {
      id: "consistent-volunteer",
      name: "Consistent Volunteer",
      icon: <Medal className="h-8 w-8 text-teal-600 dark:text-teal-500" />,
      color: "teal",
      description: "Volunteered consistently for 3+ months",
      earned: true,
      date: "2024-01-15"
    },
    {
      id: "community-builder",
      name: "Community Builder",
      icon: <Award className="h-8 w-8 text-pink-600 dark:text-pink-500" />,
      color: "pink",
      description: "Helped build stronger community connections",
      earned: false
    }
  ];
  
  // Filter earned badges
  const earnedBadges = badges.filter(badge => badge.earned);

  // Get top 5 earned badges (or all if less than 5)
  const topBadges = earnedBadges.slice(0, 5);
  
  // Calculate badge stats
  const totalBadges = badges.length;
  const earnedCount = earnedBadges.length;
  const recentBadge = earnedBadges.sort((a, b) => 
    new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
  )[0];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your Achievements</h3>
        <div className="mt-2 md:mt-0">
          {user?.id && <StreakDisplay userId={user.id} compact={true} />}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topBadges.map(badge => (
          <div 
            key={badge.id}
            className={`flex flex-col items-center p-4 bg-${badge.color}-50 dark:bg-${badge.color}-900/10 rounded-lg border border-${badge.color}-100 dark:border-${badge.color}-900/30 hover:shadow-md transition-all`}
          >
            <div className={`w-16 h-16 bg-${badge.color}-100 dark:bg-${badge.color}-900/30 rounded-full flex items-center justify-center mb-2`}>
              {badge.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">{badge.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Link 
          to="/badges" 
          className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
        >
          <span className="mr-1">View all badges</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

// Create a new component for the detailed badges page
export const AllBadges: React.FC<AchievementBadgesProps> = ({ user }) => {
  // Mock badges data - same as above, would come from backend in real app
  const badges: Badge[] = [
    {
      id: "guardian-angel",
      name: "Guardian Angel",
      icon: <HeartHandshake className="h-8 w-8 text-purple-600 dark:text-purple-500" />,
      color: "purple",
      description: "Supported 5+ events with critical needs",
      earned: true,
      date: "2023-11-15"
    },
    {
      id: "compassion-warrior",
      name: "Compassion Warrior",
      icon: <Sword className="h-8 w-8 text-red-600 dark:text-red-500" />,
      color: "red",
      description: "Completed 10+ tasks under tight deadlines",
      earned: true,
      date: "2023-12-03"
    },
    {
      id: "hope-bearer",
      name: "Hope Bearer",
      icon: <Sparkles className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />,
      color: "yellow",
      description: "Participated in 3+ community support events",
      earned: true,
      date: "2024-01-20"
    },
    {
      id: "kindness-sentinel",
      name: "Kindness Sentinel",
      icon: <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />,
      color: "blue",
      description: "Helped protect vulnerable community members",
      earned: true,
      date: "2024-02-10"
    },
    {
      id: "inclusion-champion",
      name: "Inclusion Champion",
      icon: <Users className="h-8 w-8 text-green-600 dark:text-green-500" />,
      color: "green", 
      description: "Promoted diversity and inclusion at 3+ events",
      earned: true,
      date: "2024-03-05"
    },
    {
      id: "endurance-award",
      name: "Endurance Award",
      icon: <Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />,
      color: "indigo",
      description: "Volunteered for 50+ hours total",
      earned: false
    },
    {
      id: "first-timer",
      name: "First Timer",
      icon: <Star className="h-8 w-8 text-amber-600 dark:text-amber-500" />,
      color: "amber",
      description: "Completed your first volunteer event",
      earned: true,
      date: "2023-10-05"
    },
    {
      id: "leadership",
      name: "Leadership",
      icon: <Trophy className="h-8 w-8 text-orange-600 dark:text-orange-500" />,
      color: "orange",
      description: "Led a volunteer team at an event",
      earned: false
    },
    {
      id: "consistent-volunteer",
      name: "Consistent Volunteer",
      icon: <Medal className="h-8 w-8 text-teal-600 dark:text-teal-500" />,
      color: "teal",
      description: "Volunteered consistently for 3+ months",
      earned: true,
      date: "2024-01-15"
    },
    {
      id: "community-builder",
      name: "Community Builder",
      icon: <Award className="h-8 w-8 text-pink-600 dark:text-pink-500" />,
      color: "pink",
      description: "Helped build stronger community connections",
      earned: false
    }
  ];
  
  // Calculate badge stats
  const totalBadges = badges.length;
  const earnedCount = badges.filter(badge => badge.earned).length;
  const recentBadge = badges
    .filter(badge => badge.earned)
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())[0];
    
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">All Badges</h3>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <span className="text-lg font-bold text-gray-800 dark:text-white">{earnedCount}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">of {totalBadges}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Recent Badge</h4>
        </div>
        {recentBadge && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center">
            <div className={`w-12 h-12 bg-${recentBadge.color}-100 dark:bg-${recentBadge.color}-900/30 rounded-full flex items-center justify-center mr-4`}>
              {recentBadge.icon}
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white">{recentBadge.name}</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">{recentBadge.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Earned on {new Date(recentBadge.date || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id}
            className={`flex items-center p-4 rounded-lg ${
              badge.earned 
                ? `bg-${badge.color}-50 dark:bg-${badge.color}-900/10 border border-${badge.color}-100 dark:border-${badge.color}-900/30` 
                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className={`w-12 h-12 ${
              badge.earned 
                ? `bg-${badge.color}-100 dark:bg-${badge.color}-900/30` 
                : 'bg-gray-200 dark:bg-gray-700'
            } rounded-full flex items-center justify-center mr-4`}>
              {badge.icon}
            </div>
            <div>
              <h5 className="font-medium text-gray-800 dark:text-white">{badge.name}</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400">{badge.description}</p>
              {badge.earned && badge.date && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Earned on {new Date(badge.date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
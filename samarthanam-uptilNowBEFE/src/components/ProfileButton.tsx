import React, { useState, useRef, useEffect } from 'react';
import { User, Medal, Calendar, Clock, Award, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileButtonProps {
  user: {
    id: string;
    name: string;
    email: string;
    rank: string;
    nextRank: string;
    pointsForNextRank: number;
    eventsVolunteered: number;
    volunteerHour: number;
    avatar?: string;
    phone?: string;
    location?: string;
  };
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-full overflow-hidden h-10 w-10 bg-red-600 hover:bg-red-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Profile"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback if avatar fails to load
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '';
              target.parentElement?.classList.add('fallback-avatar');
            }}
          />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-50 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in slide-in-from-top-5">
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-red-600 dark:text-red-500" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
              <div className="flex items-center">
                <Medal className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{user.rank} Volunteer</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Phone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-red-600 dark:text-red-500">
                {user.eventsVolunteered}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center">
                <Calendar className="h-3 w-3 mr-1" />
                Events
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-red-600 dark:text-red-500">
                {user.volunteerHour}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-center">
                <Clock className="h-3 w-3 mr-1" />
                Hours
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-600 dark:text-gray-400">
              <Award className="h-4 w-4 inline mr-1 text-yellow-500" />
              Next Rank: {user.nextRank}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {user.pointsForNextRank} points needed
            </span>
          </div>
          
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
            <div className="h-2 bg-red-600 rounded-full" style={{ width: '60%' }}></div>
          </div>
          
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link 
              to="/volunteer-dashboard"
              className="text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/badges"
              className="text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              View Badges
            </Link>
            <Link 
              to="/settings"
              className="text-sm text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton; 
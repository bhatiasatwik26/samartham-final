import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { User, Users, UserPlus } from 'lucide-react';
import { useInView } from '@/lib/animate';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SignIn = () => {
  const { ref, isVisible } = useInView();
  const navigate = useNavigate();
  
  const handleAdminClick = () => {
    // Navigate to admin login page
    navigate('/admin-login');
  };
  
  const handleVolunteerClick = () => {
    // Navigate to volunteer login page
    navigate('/volunteer-login');
  };

  const handleParticipantClick = () => {
    // Navigate to participant login page
    navigate('/participant-login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6" ref={ref}>
          <div className={cn(
            "max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Sign In
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Please select your account type to continue
                </p>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleAdminClick}
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center hover:border-red-500 dark:hover:border-red-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sign in as Admin</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">For organization administrators and event managers</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={handleVolunteerClick}
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center hover:border-red-500 dark:hover:border-red-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sign in as Volunteer</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">For volunteers and event participants</p>
                    </div>
                  </button>
                  
                  <button 
                    onClick={handleParticipantClick}
                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center hover:border-red-500 dark:hover:border-red-500 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                      <UserPlus className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sign in as Participant</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">For event participants and registrants</p>
                    </div>
                  </button>
                </div>
                
                <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
                  Don't have an account? <Link to="/participant-registration" className="text-red-600 dark:text-red-400 hover:underline">Sign up</Link>
                </p>
              </div>
              
              <div className="hidden md:block relative bg-red-600">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 mix-blend-multiply"></div>
                <img 
                  src="/images/volunteers-working.jpg" 
                  alt="Volunteers working together" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-white">
                  <h2 className="text-3xl font-bold mb-4 text-center">Make a Difference with Samarthanam</h2>
                  <p className="text-center text-white/80">
                    Join our community of volunteers dedicated to creating a more inclusive world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignIn; 
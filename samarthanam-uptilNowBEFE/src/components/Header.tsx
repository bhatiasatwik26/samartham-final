import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ProfileButton from './ProfileButton';

interface HeaderProps {
  isAdmin?: boolean;
  user?: any;
}

export const Header = ({ isAdmin = false, user }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is on volunteer dashboard or badges page
  const isLoggedIn = location.pathname === '/volunteer-dashboard' || 
                     location.pathname === '/badges' ||
                     location.pathname === '/admin-dashboard';

  // Mock user data for development (will be replaced with actual user data)
  const mockUser = {
    id: "001",
    name: "John Doe",
    email: "john.doe@example.com",
    rank: "gold",
    nextRank: "platinum",
    pointsForNextRank: 250,
    eventsVolunteered: 12,
    volunteerHour: 48,
    phone: "+1 (555) 123-4567",
    location: "Bangalore, India"
  };

  // Use provided user or fallback to mock user
  const currentUser = user || mockUser;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  
  const handleLogout = () => {
    // In a real app, you would clear authentication tokens, cookies, etc.
    // For now, just redirect to home page
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Help', href: '/help' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-soft dark:bg-gray-900/90'
          : 'bg-transparent'
      )}
    >
      <div className={cn(
        "px-4",
        isAdmin ? "ml-72 mr-4" : "container mx-auto"
      )}>
        <div className="flex items-center justify-end">
          {!isAdmin && (
            <div className="flex items-center mr-auto">
              <Link to="/" className="flex items-center" aria-label="Samarthanam NGO Home">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg overflow-hidden">
                  <img 
                    src="/images/logo_for_site.jpg" 
                    alt="Samarthanam NGO" 
                    className="h-16 md:h-20 w-auto rounded-md"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/300x300?text=Logo";
                    }}
                  />
                </div>
              </Link>
            </div>
          )}

          {/* Desktop Navigation - Only show if not admin page */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-800 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn && (
                <>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="px-6 py-2 rounded-full border-red-600 hover:bg-red-800 text-red-600 hover:text-white font-medium transition-colors shadow-sm hover:shadow-md flex items-center"
                    aria-label="Log out"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                  <ProfileButton user={currentUser} />
                </>
              )}
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-red-600 bg-red-600 text-white hover:bg-red-800"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </nav>
          )}

          {/* Admin Header - Only show in admin pages */}
          {isAdmin && (
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-800 text-white font-medium transition-colors shadow-sm hover:shadow-md"
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn && (
                <>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="px-6 py-2 rounded-full border-red-600 hover:bg-red-800 text-red-600 hover:text-white font-medium transition-colors shadow-sm hover:shadow-md flex items-center"
                    aria-label="Log out"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                  <ProfileButton user={currentUser} />
                </>
              )}
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="icon"
                className="rounded-full h-10 w-10 border-red-600 bg-red-600 text-white hover:bg-red-800"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </nav>
          )}

          {/* Mobile Menu Button - For both admin and regular pages */}
          <div className="md:hidden flex items-center gap-4 ml-auto">
            {isLoggedIn && (
              <>
                <ProfileButton user={currentUser} />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 border-red-600 text-red-600 hover:bg-red-800 hover:text-white"
                  aria-label="Log out"
                >
                  <LogOut size={20} />
                </Button>
              </>
            )}
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10 border-red-600 bg-red-600 text-white hover:bg-red-800"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <button
              className="text-white bg-red-600 hover:bg-red-800 p-2 rounded-full transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Show for both admin and regular pages */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in bg-white/95 dark:bg-gray-900/95 mt-2 rounded-lg shadow-md">
            <nav className="flex flex-col space-y-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-6 py-2 rounded-full bg-red-600 hover:bg-red-800 text-white font-medium transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="px-6 py-2 rounded-full border-red-600 hover:bg-red-800 text-red-600 hover:text-white font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
                  aria-label="Log out"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

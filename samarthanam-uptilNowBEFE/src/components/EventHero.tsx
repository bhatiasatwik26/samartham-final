import { useInView } from '@/lib/animate';
import { ArrowRight, Users, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface EventHeroProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  location: string;
  showButtons?: boolean;
}

const EventHero = ({
  imageUrl = "https://images.unsplash.com/photo-1560252829-804f1aedf1be?q=80&w=2070&auto=format&fit=crop",
  title = "Join Hands to Make a Difference",
  subtitle = "Samarthanam NGO",
  description = "Together we can create inclusive communities that empower individuals with disabilities. Be part of our mission to build a world where everyone has equal opportunities to thrive.",
  date,
  time,
  location,
  showButtons = true
}: EventHeroProps) => {
  const { ref, isVisible } = useInView();

  return (
    <div
      className="relative min-h-screen flex items-center overflow-hidden"
      ref={ref}
      id="hero"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/80 mix-blend-multiply z-10"></div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 pt-20 z-10 relative">
        <div className="max-w-3xl">
          <div className={cn(
            "transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <span className="inline-block py-1 px-3 rounded-full bg-red-600/10 text-red-200 text-sm font-medium backdrop-blur-sm border border-red-500/20 mb-4" aria-label={subtitle}>
              {subtitle}
            </span>
          </div>

          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 transition-all duration-700 delay-100 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            {title}
          </h1>

          <p className={cn(
            "text-lg text-white/90 mb-8 max-w-xl transition-all duration-700 delay-200 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            {description}
          </p>

          {/* Event Details */}
          {(date || time || location) && (
            <div className={cn(
              "flex flex-col gap-2 mb-8 transition-all duration-700 delay-300 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}>
              {date && (
                <div className="flex items-center text-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{date}</span>
                </div>
              )}
              
              {time && (
                <div className="flex items-center text-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{time}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center text-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location}</span>
                </div>
              )}
            </div>
          )}

          {showButtons && (
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}>
              <Button 
                className="rounded-full bg-red-600 hover:bg-red-800 text-white px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300 button-hover-effect"
                aria-label="Sign up to join Samarthanam NGO"
              >
                <Users className="mr-2 h-5 w-5" />
                Sign Up
              </Button>
              
              <Link to="/signin">
                <Button
                  variant="default"
                  className="rounded-full bg-red-600 hover:bg-red-800 text-white px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300 button-hover-effect"
                  aria-label="Sign in to your account"
                >
                  <User className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
              
              <Link to="/events">
                <Button
                  variant="secondary"
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white px-8 py-6 shadow-md hover:shadow-lg transition-all duration-300"
                  aria-label="Explore events from Samarthanam NGO"
                >
                  Explore Events
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Wave Element */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
      <svg
        className="absolute bottom-0 left-0 w-full z-10 text-background fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
      >
        <path
          d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,85.3C672,96,768,96,864,96C960,96,1056,96,1152,85.3C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default EventHero;

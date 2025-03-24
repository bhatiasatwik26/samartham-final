import { useState, useEffect } from 'react';
import { useInView } from '@/lib/animate';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventCountdownProps {
  eventName?: string;
  eventDate?: Date;
  eventLocation?: string;
}

const EventCountdown = ({
  eventName = "Annual Charity Walkathon",
  eventDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  eventLocation = "Bangalore, Karnataka",
}: EventCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const { ref, isVisible } = useInView();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = eventDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [eventDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section 
      className="py-20 bg-white dark:bg-gray-950" 
      ref={ref}
      id="upcoming-event"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className={cn(
            "text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Next Upcoming Event
          </h2>
          <p className={cn(
            "max-w-2xl mx-auto text-gray-600 dark:text-gray-300 transition-all duration-700 delay-100 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Mark your calendar and join us for our upcoming event
          </p>
        </div>

        <div className={cn(
          "bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-md overflow-hidden border border-red-100 dark:border-red-900/20 transition-all duration-700 delay-200 transform",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {eventName}
              </h3>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                <Calendar size={18} className="mr-2 text-red-500" />
                <span>{formatDate(eventDate)}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4">
                <MapPin size={18} className="mr-2 text-red-500" />
                <span>{eventLocation}</span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join us for a day of community service and fundraising. Together, we can make a significant impact in the lives of those in need.
              </p>
              
              <Button className="rounded-full bg-red-600 hover:bg-red-800 text-white px-6 py-2">
                Register Now
              </Button>
            </div>
            
            <div className="bg-red-600 p-8 md:p-12 flex items-center justify-center">
              <div className="text-center">
                <h4 className="text-xl font-medium mb-4 text-white">Event Starts In</h4>
                <div className="grid grid-cols-4 gap-4 text-white" aria-live="polite">
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold" aria-label={`${timeLeft.days} days`}>{timeLeft.days}</div>
                    <div className="text-sm opacity-80">Days</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold" aria-label={`${timeLeft.hours} hours`}>{timeLeft.hours}</div>
                    <div className="text-sm opacity-80">Hours</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold" aria-label={`${timeLeft.minutes} minutes`}>{timeLeft.minutes}</div>
                    <div className="text-sm opacity-80">Minutes</div>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-4xl font-bold" aria-label={`${timeLeft.seconds} seconds`}>{timeLeft.seconds}</div>
                    <div className="text-sm opacity-80">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventCountdown; 
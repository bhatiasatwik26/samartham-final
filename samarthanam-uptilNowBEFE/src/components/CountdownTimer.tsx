
import { useState, useEffect } from 'react';
import { useInView } from '@/lib/animate';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const { ref, isVisible } = useInView();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Initial calculation
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div 
      className="py-12 bg-event-darkest-gray relative overflow-hidden"
      ref={ref}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            "text-center mb-8 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
              Event Starts In
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {timeBlocks.map((block, index) => (
              <div 
                key={block.label} 
                className={cn(
                  "w-[65px] sm:w-[100px] md:w-[130px] text-center transition-all duration-700 transform",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-12",
                  { "delay-100": index === 0, "delay-200": index === 1, "delay-300": index === 2, "delay-400": index === 3 }
                )}
              >
                <div className="bg-event-blue/10 backdrop-blur-sm border border-event-blue/20 rounded-lg p-4 mb-2 animate-pulse-soft">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                    {block.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-sm font-medium text-white/80">
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

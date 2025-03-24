import { useInView } from '@/lib/animate';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

interface EventScheduleProps {
  title: string;
  subtitle: string;
  scheduleItems: ScheduleItem[];
}

const EventSchedule = ({
  title,
  subtitle,
  scheduleItems,
}: EventScheduleProps) => {
  const { ref, isVisible } = useInView();

  return (
    <section 
      className="py-20 bg-gray-50" 
      id="schedule"
      ref={ref}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn(
            "text-center mb-16 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <span className="inline-block py-1 px-3 rounded-full bg-red-600/10 text-red-600 text-sm font-medium mb-4">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-red-500/20 md:left-1/2 md:-ml-0.5"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {scheduleItems.map((item, index) => (
                <div key={index} className={cn(
                  "relative transition-all duration-700 transform",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-12",
                  { "delay-100": index === 0, "delay-200": index === 1, "delay-300": index === 2, "delay-400": index === 3, "delay-500": index >= 4 }
                )}>
                  <div className="flex items-center md:justify-center mb-2 relative">
                    <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-red-600 shadow-sm text-white text-xs">
                      {index + 1}
                    </div>
                    <div className="ml-4 md:ml-0 md:absolute md:left-0 md:w-[calc(50%-2rem)] md:text-right md:pr-8">
                      <span className="text-red-600 font-medium">{item.time}</span>
                    </div>
                  </div>

                  <div className="ml-12 md:ml-0 md:w-[calc(50%-2rem)] md:ml-[calc(50%+2rem)]">
                    <div className="p-5 rounded-lg bg-white shadow-soft hover:shadow-medium transition-shadow duration-300 border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventSchedule;

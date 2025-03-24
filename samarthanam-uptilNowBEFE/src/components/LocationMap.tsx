
import { useEffect, useRef } from 'react';
import { useInView } from '@/lib/animate';
import { MapPin, Clock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationMapProps {
  title: string;
  subtitle: string;
  address: string;
  timings: string;
  contactPhone: string;
  mapImageUrl: string; // We'll use a static map image for simplicity
}

const LocationMap = ({
  title,
  subtitle,
  address,
  timings,
  contactPhone,
  mapImageUrl,
}: LocationMapProps) => {
  const { ref, isVisible } = useInView();

  return (
    <section 
      className="py-20 bg-event-lightest-gray"
      id="location"
      ref={ref}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className={cn(
            "text-center mb-16 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <span className="inline-block py-1 px-3 rounded-full bg-event-blue/10 text-event-blue text-sm font-medium mb-4">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-event-darkest-gray mb-4">
              {title}
            </h2>
            <div className="w-16 h-1 bg-event-blue mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className={cn(
              "lg:col-span-3 transition-all duration-700 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}>
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl shadow-medium">
                <img 
                  src={mapImageUrl} 
                  alt="Event Location Map" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className={cn(
              "lg:col-span-2 transition-all duration-700 transform",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}>
              <div className="h-full bg-white rounded-xl p-8 shadow-medium">
                <h3 className="text-xl font-bold text-event-darkest-gray mb-6">Event Location Details</h3>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-event-blue/10 flex items-center justify-center">
                      <MapPin className="text-event-blue" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-event-darkest-gray">Address</h4>
                      <p className="text-event-medium-gray">{address}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-event-blue/10 flex items-center justify-center">
                      <Clock className="text-event-blue" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-event-darkest-gray">Event Timings</h4>
                      <p className="text-event-medium-gray">{timings}</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-event-blue/10 flex items-center justify-center">
                      <Phone className="text-event-blue" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-event-darkest-gray">Contact</h4>
                      <p className="text-event-medium-gray">{contactPhone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-event-light-gray">
                  <h4 className="text-sm font-semibold text-event-darkest-gray mb-3">Directions</h4>
                  <p className="text-event-medium-gray text-sm mb-4">
                    The venue is easily accessible by public transportation and has ample parking space available.
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-event-blue hover:text-event-dark-blue transition-colors text-sm font-medium flex items-center"
                  >
                    Get Directions
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;

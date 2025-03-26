import { useInView } from '@/lib/animate';
import { cn } from '@/lib/utils';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

const Testimonials = () => {
  const { ref, isVisible } = useInView();

  const testimonials: Testimonial[] = [
    {
      quote: "Volunteering with Samarthanam changed my perspective on life. The inclusive environment and meaningful work have been incredibly rewarding.",
      name: "Priya Sharma",
      role: "Volunteer since 2021",
      image: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=1287&auto=format&fit=crop",
    },
    {
      quote: "The accessibility features on this platform made it easy for me to participate in events despite my visual impairment. Truly inclusive!",
      name: "Rajesh Kumar",
      role: "Program Participant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop",
    },
    {
      quote: "As an event organizer, I've seen firsthand how Samarthanam creates opportunities for people with disabilities to showcase their talents.",
      name: "Ananya Gupta",
      role: "Event Coordinator",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop",
    },
  ];

  return (
    <section 
      className="py-20 bg-gray-50 dark:bg-gray-900" 
      ref={ref}
      id="testimonials"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Stories of Impact
          </h2>
          <p className={cn(
            "max-w-2xl mx-auto text-gray-600 dark:text-gray-300 transition-all duration-700 delay-100 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Hear from volunteers and participants who have been part of our journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col transform",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12",
                isVisible && `transition-all duration-700 delay-${index * 100}`
              )}
            >
              <Quote className="h-10 w-10 text-red-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 
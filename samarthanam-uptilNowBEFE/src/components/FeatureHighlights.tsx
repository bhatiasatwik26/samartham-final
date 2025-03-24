import { useInView } from '@/lib/animate';
import { cn } from '@/lib/utils';
import { Calendar, Users, Accessibility } from 'lucide-react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureHighlights = () => {
  const { ref, isVisible } = useInView();

  const features: FeatureItem[] = [
    {
      icon: <Calendar className="h-12 w-12 text-red-500" />,
      title: "Event Management",
      description: "Easily browse, register, and participate in charity events, fundraisers, workshops, and community activities organized by Samarthanam.",
    },
    {
      icon: <Users className="h-12 w-12 text-red-500" />,
      title: "Volunteer Matching",
      description: "Find opportunities that match your skills and interests. Our platform connects volunteers with the perfect roles to make a meaningful impact.",
    },
    {
      icon: <Accessibility className="h-12 w-12 text-red-500" />,
      title: "Accessibility First",
      description: "Our platform is designed with accessibility in mind, featuring screen reader support, keyboard navigation, and high-contrast visuals for all users.",
    },
  ];

  return (
    <section 
      className="py-20 bg-white dark:bg-gray-950" 
      ref={ref}
      id="features"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            How We Make a Difference
          </h2>
          <p className={cn(
            "max-w-2xl mx-auto text-gray-600 dark:text-gray-300 transition-all duration-700 delay-100 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            Samarthanam provides tools and resources that empower individuals to contribute to meaningful causes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center transform",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12",
                isVisible && `transition-all duration-700 delay-${index * 100}`
              )}
            >
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights; 
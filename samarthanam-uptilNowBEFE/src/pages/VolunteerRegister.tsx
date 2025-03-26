import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VolunteerRegistrationForm } from '@/pages/volunteer/components';
import { useInView } from '@/lib/animate';
import { cn } from '@/lib/utils';

const VolunteerRegister = () => {
  const { ref, isVisible } = useInView();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4" ref={ref}>
          <div className={cn(
            "max-w-3xl mx-auto transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <VolunteerRegistrationForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VolunteerRegister; 
import { useEffect } from 'react';
import Header from '@/components/Header';
import EventHero from '@/components/EventHero';
import FeatureHighlights from '@/components/FeatureHighlights';
import EventCountdown from '@/components/EventCountdown';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Simple fade-in animation for sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.section-fade-up');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Background image for the hero section with error handling
  const heroImageUrl = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop";

  // Date for the upcoming event (30 days from now)
  const upcomingEventDate = new Date();
  upcomingEventDate.setDate(upcomingEventDate.getDate() + 30);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <EventHero imageUrl={heroImageUrl} />
        <FeatureHighlights />
        <EventCountdown 
          eventName="Annual Charity Walkathon" 
          eventDate={upcomingEventDate}
          eventLocation="Bangalore, Karnataka"
        />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

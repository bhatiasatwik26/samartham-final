
import { useRef, useState } from 'react';
import { useInView } from '@/lib/animate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Image {
  src: string;
  alt: string;
}

interface ImageGalleryProps {
  title: string;
  subtitle: string;
  images: Image[];
}

const ImageGallery = ({
  title,
  subtitle,
  images,
}: ImageGalleryProps) => {
  const { ref, isVisible } = useInView();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    // Update scroll position after scrolling
    setTimeout(() => {
      if (container) {
        setScrollPosition(container.scrollLeft);
      }
    }, 300);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollContainerRef.current
    ? scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
    : false;

  return (
    <section 
      className="py-20 bg-white"
      id="gallery"
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

          <div className={cn(
            "relative transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            {/* Navigation Buttons */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between -translate-y-1/2 z-10 px-4 md:px-8 pointer-events-none">
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border-0 shadow-medium hover:bg-white transition-all pointer-events-auto",
                  !canScrollLeft && "opacity-0"
                )}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-5 w-5 text-event-darkest-gray" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border-0 shadow-medium hover:bg-white transition-all pointer-events-auto",
                  !canScrollRight && "opacity-0"
                )}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-5 w-5 text-event-darkest-gray" />
              </Button>
            </div>

            {/* Gallery */}
            <div 
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
              onScroll={handleScroll}
            >
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[300px] md:w-[400px] snap-start"
                >
                  <div className="rounded-xl overflow-hidden shadow-medium bg-event-lightest-gray h-[250px] md:h-[300px] transform transition-transform hover:scale-[1.01] duration-300">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
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

export default ImageGallery;

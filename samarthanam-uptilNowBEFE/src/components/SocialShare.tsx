
import { useInView } from '@/lib/animate';
import { Facebook, Twitter, Linkedin, Mail, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SocialShareProps {
  title: string;
  subtitle: string;
  eventUrl: string;
}

const SocialShare = ({
  title,
  subtitle,
  eventUrl,
}: SocialShareProps) => {
  const { ref, isVisible } = useInView();

  const shareLinks = [
    { 
      name: 'Facebook', 
      icon: Facebook, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
      color: 'bg-[#1877F2]/10 text-[#1877F2]'
    },
    { 
      name: 'Twitter', 
      icon: Twitter, 
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(title)}`,
      color: 'bg-[#1DA1F2]/10 text-[#1DA1F2]'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(eventUrl)}&title=${encodeURIComponent(title)}`,
      color: 'bg-[#0A66C2]/10 text-[#0A66C2]'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this event: ${eventUrl}`)}`,
      color: 'bg-[#EA4335]/10 text-[#EA4335]'
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl).then(() => {
      toast.success('Link copied to clipboard!');
    });
  };

  return (
    <section 
      className="py-16 bg-event-lightest-gray"
      id="share"
      ref={ref}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "text-center mb-12 transition-all duration-700 transform",
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
            "transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center mb-6">
                <input
                  readOnly
                  value={eventUrl}
                  className="flex-grow bg-event-lightest-gray rounded-l-md py-3 px-4 outline-none border border-event-light-gray/50 text-event-medium-gray"
                />
                <Button
                  onClick={copyToClipboard}
                  className="rounded-r-md bg-event-blue text-white px-4 py-3 h-full"
                >
                  <Copy size={18} />
                  <span className="ml-2 hidden sm:inline">Copy</span>
                </Button>
              </div>

              <p className="text-event-medium-gray text-sm mb-6 text-center">
                Or share directly on your favorite social media platform
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2 py-2 px-4 rounded-md transition-all hover:shadow-sm",
                      link.color
                    )}
                  >
                    <link.icon size={18} />
                    <span className="text-sm font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialShare;

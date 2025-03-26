import { useState } from 'react';
import { useInView } from '@/lib/animate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RegistrationFormProps {
  title: string;
  subtitle: string;
  onSubmit?: () => void;
}

const RegistrationForm = ({
  title,
  subtitle,
  onSubmit
}: RegistrationFormProps) => {
  const { ref, isVisible } = useInView();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration submitted successfully!', {
        description: 'We will contact you with further details.',
      });
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit();
      }
    }, 1500);
  };

  return (
    <section 
      className="py-20 bg-white"
      id="register"
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

          <div className={cn(
            "bg-gray-50 rounded-xl p-8 shadow-medium transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participationType">Participation Type</Label>
                <select
                  id="participationType"
                  className="w-full rounded-md border border-gray-300/50 p-2 focus:border-red-600 focus:ring-red-600/20 focus:outline-none"
                >
                  <option value="" disabled selected>Select participation type</option>
                  <option value="individual">Individual</option>
                  <option value="team">Team (5-10 members)</option>
                  <option value="corporate">Corporate Team</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <textarea
                  id="message"
                  rows={3}
                  placeholder="Tell us any additional information we should know..."
                  className="w-full rounded-md border border-gray-300/50 p-3 focus:border-red-600 focus:ring-red-600/20 focus:outline-none"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-red-600 hover:underline">terms and conditions</a> and the <a href="#" className="text-red-600 hover:underline">privacy policy</a>.
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full rounded-md bg-red-600 hover:bg-red-800 text-white py-6 transition-all duration-300",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                {loading ? "Processing..." : "Register Now"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;

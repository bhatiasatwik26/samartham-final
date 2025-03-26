import { useState } from "react";
import { useInView } from "@/lib/animate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useParams } from "react-router-dom";

interface RegistrationFormProps {
  title: string;
  subtitle: string;
}

const RegistrationForm = ({ title, subtitle }: RegistrationFormProps) => {
  const { ref, isVisible } = useInView();
  const [loading, setLoading] = useState(false);
  const [participationType, setParticipationType] = useState<string>("");
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const values = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      participationType: formData.get("participationType") as string,
      message: formData.get("message") as string,
      terms: formData.get("terms") ? "accepted" : "not accepted",
      eventId:id
    };
    console.log(values);
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/user/registerVolunteerOrPart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      toast.success("Participant registration successful!");
    } catch (error) {
      console.error("Participant registration failed:", error);
      toast.error("Failed to register as Participant.");
    } finally {
      setLoading(false);
    }

    console.log("Form Values:", values);
  };

  return (
    <section className="py-20 bg-white" id="register" ref={ref}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={cn(
              "text-center mb-16 transition-all duration-700 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            )}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-red-600/10 text-red-600 text-sm font-medium mb-4">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto"></div>
          </div>

          <div
            className={cn(
              "bg-gray-50 rounded-xl p-8 shadow-medium transition-all duration-700 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            )}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName" // Add name attribute
                    placeholder="John"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName" // Add name attribute
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
                    name="email" // Add name attribute
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
                    name="phone" // Add name attribute
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
                  name="participationType" // Add name attribute
                  className="w-full rounded-md border border-gray-300/50 p-2 focus:border-red-600 focus:ring-red-600/20 focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    Select participation type
                  </option>
                  <option value="participant">Participant</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Information</Label>
                <textarea
                  id="message"
                  name="message" // Add name attribute
                  rows={3}
                  placeholder="Tell us any additional information we should know..."
                  className="w-full rounded-md border border-gray-300/50 p-3 focus:border-red-600 focus:ring-red-600/20 focus:outline-none"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  name="terms" // Add name attribute
                  className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    terms and conditions
                  </a>{" "}
                  and the{" "}
                  <a href="#" className="text-red-600 hover:underline">
                    privacy policy
                  </a>
                  .
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-red-600 hover:bg-red-800 text-white py-6 transition-all duration-300"
              >
                Register Now
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;

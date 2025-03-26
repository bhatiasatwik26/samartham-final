import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useInView } from "@/lib/animate";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE_URL = "http://localhost:3000/api";

const ParticipantRegistration = () => {
  const { ref, isVisible } = useInView();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API endpoint for participant registration
      const API_URL = `${API_BASE_URL}/participant/signup`; // Replace with your backend URL

      const formData = {
        firstName: (document.getElementById("firstName") as HTMLInputElement)
          .value,
        lastName: (document.getElementById("lastName") as HTMLInputElement)
          .value,
        email: (document.getElementById("email") as HTMLInputElement).value,
        phone: (document.getElementById("phone") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement)
          .value,
        interestedEvents: [
          (document.getElementById("event1") as HTMLInputElement).checked
            ? "Run for Vision 2024"
            : "",
          (document.getElementById("event2") as HTMLInputElement).checked
            ? "Annual Charity Marathon"
            : "",
          (document.getElementById("event3") as HTMLInputElement).checked
            ? "Awareness Workshop"
            : "",
          (document.getElementById("event4") as HTMLInputElement).checked
            ? "Cultural Festival"
            : "",
        ].filter(Boolean), // Remove empty values
        additionalInfo: (document.getElementById("message") as HTMLInputElement)
          .value,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Registration successful!", {
        description:
          result.message || "You have been registered as a participant.",
      });

      // Redirect to participant dashboard
      navigate("/participant-login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6" ref={ref}>
          <div
            className={cn(
              "max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-700 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            )}
          >
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Participant Registration
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Register as a participant to join events and activities
              </p>

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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Interested Events (You can register for events later too)
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="event1" />
                      <Label htmlFor="event1" className="text-sm">
                        Run for Vision 2024
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="event2" />
                      <Label htmlFor="event2" className="text-sm">
                        Annual Charity Marathon
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="event3" />
                      <Label htmlFor="event3" className="text-sm">
                        Awareness Workshop
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="event4" />
                      <Label htmlFor="event4" className="text-sm">
                        Cultural Festival
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Tell us any additional information we should know..."
                    className="w-full rounded-md border border-gray-300/50 p-3 focus:border-red-600 focus:ring-red-600/20 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    required
                    className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
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
                  disabled={loading}
                  className={cn(
                    "w-full rounded-md bg-red-600 hover:bg-red-800 text-white py-6 transition-all duration-300",
                    loading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {loading ? "Processing..." : "Register Now"}
                </Button>

                <p className="text-center text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/signin"
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParticipantRegistration;

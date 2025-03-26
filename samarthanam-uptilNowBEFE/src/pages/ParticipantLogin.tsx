import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useInView } from "@/lib/animate";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus } from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

const ParticipantLogin = () => {
  const { ref, isVisible } = useInView();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/participant/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to login");
      }

      const { participantId } = await response.json();
      toast.success("Login successful!");

      // Store ID in local storage or state management
      localStorage.setItem(
        "participant_auth",
        JSON.stringify({ isAuthenticated: true, participantId })
      );

      navigate("/participant-dashboard");
    } catch (error: any) {
      setError(error.message);
      toast.error("Login failed: " + error.message);
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
              "max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-700 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            )}
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Participant Login
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Sign in to access your participant dashboard
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="rounded-md border-gray-300/50 focus:border-red-600 focus:ring-red-600/20"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Remember me for 30 days
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
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ParticipantLogin;

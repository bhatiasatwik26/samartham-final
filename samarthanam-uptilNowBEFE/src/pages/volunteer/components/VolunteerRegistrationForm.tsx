import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:3000/api";

const VolunteerRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interestedCategories: [],
    interestedTasks: [],
    skills: [],
    availability: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = `${API_BASE_URL}/user/register`;

      const submission = {
        email: formData.email,
        name: formData.name,
        interestedCategories: formData.interestedCategories,
        interestedTasks: formData.interestedTasks,
        skills: formData.skills,
        availability: formData.availability,
      };
      console.log(submission);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      toast.success("Registration successful!", {
        description:
          result.message || "You have been registered as a volunteer.",
      });

      // Navigate to volunteer dashboard or login
      navigate("/volunteer-login");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Education",
    "Healthcare",
    "Environment",
    "Sports",
    "Arts & Culture",
    "Community Service",
  ];

  const tasks = [
    "Event Coordination",
    "Teaching",
    "Medical Support",
    "Administrative Work",
    "Fundraising",
    "Technical Support",
  ];

  const skillsList = [
    "Leadership",
    "Communication",
    "First Aid",
    "Teaching",
    "Technical",
    "Organization",
    "Languages",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArraySelection = (field, value) => {
    setFormData((prev) => {
      const currentArray = [...prev[field]];
      const index = currentArray.indexOf(value);

      if (index === -1) {
        currentArray.push(value);
      } else {
        currentArray.splice(index, 1);
      }

      return {
        ...prev,
        [field]: currentArray,
      };
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     // Here you would typically make an API call to your backend
  //     // For now, we'll just simulate it
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Add today's date to heatmap activity
  //     const submission = {
  //       ...formData,
  //       heatmapActivity: [
  //         {
  //           date: new Date(),
  //           count: 1,
  //         },
  //       ],
  //     };

  //     console.log("Form submission:", submission);

  //     toast.success("Registration successful!", {
  //       description: "You have been registered as a volunteer.",
  //     });

  //     // Navigate to volunteer dashboard or login
  //     navigate("/volunteer-login");
  //   } catch (error) {
  //     toast.error("Registration failed", {
  //       description: "Please try again later.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Volunteer Registration
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Register as a volunteer to help with our events and make a difference.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Interested Categories */}
        <div className="space-y-3">
          <Label>Interested Categories</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={formData.interestedCategories.includes(category)}
                  onCheckedChange={() =>
                    handleArraySelection("interestedCategories", category)
                  }
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor={`category-${category}`}>{category}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Interested Tasks */}
        <div className="space-y-3">
          <Label>Interested Tasks</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <div key={task} className="flex items-center space-x-2">
                <Checkbox
                  id={`task-${task}`}
                  checked={formData.interestedTasks.includes(task)}
                  onCheckedChange={() =>
                    handleArraySelection("interestedTasks", task)
                  }
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor={`task-${task}`}>{task}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label>Skills</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skillsList.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={formData.skills.includes(skill)}
                  onCheckedChange={() => handleArraySelection("skills", skill)}
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor={`skill-${skill}`}>{skill}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-3">
          <Label>Availability</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={formData.availability.includes(day)}
                  onCheckedChange={() =>
                    handleArraySelection("availability", day)
                  }
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor={`day-${day}`}>{day}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full bg-red-600 hover:bg-red-700 text-white",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? "Registering..." : "Register as Volunteer"}
        </Button>
      </form>
    </div>
  );
};

export default VolunteerRegistrationForm;

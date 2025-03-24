export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  scheduleItems: {
    time: string;
    title: string;
    description: string;
  }[];
}

export const events: Event[] = [
  {
    id: "event-1",
    title: "Annual Charity Walkathon 2023",
    subtitle: "Walk for a Cause",
    description: "Join us for our annual walkathon to raise funds for education programs. This family-friendly event welcomes participants of all ages and abilities. Together, we can make a difference in the lives of children who need educational support.",
    date: "October 15, 2023",
    time: "8:00 AM - 12:00 PM",
    location: "Central Park, New York",
    imageUrl: "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "8:00 AM",
        title: "Registration & Check-in",
        description: "Arrive early to complete your registration and receive your participant packet."
      },
      {
        time: "8:30 AM",
        title: "Opening Ceremony",
        description: "Welcome address by our Executive Director and special guests."
      },
      {
        time: "9:00 AM",
        title: "Walkathon Begins",
        description: "Start of the 5K walk around the scenic route of Central Park."
      },
      {
        time: "11:00 AM",
        title: "Finish Line Celebration",
        description: "Refreshments, entertainment, and celebration at the finish line."
      }
    ]
  },
  {
    id: "event-2",
    title: "Tech for All Hackathon",
    subtitle: "Coding for Accessibility",
    description: "A 48-hour hackathon focused on developing innovative solutions for people with disabilities. Bring your coding skills and creativity to help create technology that makes a difference in people's lives.",
    date: "November 5-7, 2023",
    time: "Starts at 6:00 PM",
    location: "Tech Hub, San Francisco",
    imageUrl: "https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "6:00 PM",
        title: "Registration & Networking",
        description: "Meet your fellow participants and form teams."
      },
      {
        time: "7:00 PM",
        title: "Kickoff & Challenge Announcement",
        description: "Learn about the specific challenges and judging criteria."
      },
      {
        time: "8:00 PM",
        title: "Hacking Begins",
        description: "Start working on your innovative solutions."
      },
      {
        time: "Sunday, 12:00 PM",
        title: "Project Submissions Due",
        description: "All teams must submit their projects for judging."
      }
    ]
  },
  {
    id: "event-3",
    title: "Benefit Concert for Education",
    subtitle: "Music for Change",
    description: "An evening of inspiring performances by renowned artists to raise funds for our education initiatives. Enjoy great music while supporting a worthwhile cause.",
    date: "December 10, 2023",
    time: "7:00 PM - 10:00 PM",
    location: "Grand Auditorium, Chicago",
    imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "6:00 PM",
        title: "Doors Open",
        description: "Early entry for VIP ticket holders."
      },
      {
        time: "7:00 PM",
        title: "Welcome & Introduction",
        description: "Opening remarks about our mission and impact."
      },
      {
        time: "7:30 PM",
        title: "First Performance",
        description: "Live music by our featured artists."
      },
      {
        time: "9:30 PM",
        title: "Closing Remarks",
        description: "Thank you address and information on how to get involved."
      }
    ]
  },
  {
    id: "event-4",
    title: "Green Earth Sustainability Fair",
    subtitle: "Eco-Friendly Solutions",
    description: "A community-oriented fair showcasing sustainable practices, eco-friendly products, and educational workshops. Learn how small changes can have a big impact on our planet's health.",
    date: "January 20, 2024",
    time: "10:00 AM - 5:00 PM",
    location: "Community Center, Seattle",
    imageUrl: "https://images.pexels.com/photos/5748516/pexels-photo-5748516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "10:00 AM",
        title: "Exhibition Opens",
        description: "Visit booths from local sustainable businesses and organizations."
      },
      {
        time: "11:30 AM",
        title: "Workshop: Home Composting",
        description: "Learn how to start and maintain a successful composting system at home."
      },
      {
        time: "1:00 PM",
        title: "Panel Discussion: Sustainable Cities",
        description: "Experts discuss how urban areas can become more environmentally friendly."
      },
      {
        time: "3:00 PM",
        title: "DIY Upcycling Workshop",
        description: "Turn everyday waste items into useful household products."
      }
    ]
  },
  {
    id: "event-5",
    title: "Youth Leadership Summit",
    subtitle: "Empowering Future Leaders",
    description: "A 3-day summit designed to inspire and equip young people with leadership skills, entrepreneurial thinking, and civic engagement knowledge. Open to high school and college students.",
    date: "February 15-17, 2024",
    time: "9:00 AM - 4:00 PM daily",
    location: "University Campus, Boston",
    imageUrl: "https://images.pexels.com/photos/7648476/pexels-photo-7648476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "Day 1, 9:00 AM",
        title: "Opening Keynote: The Leader Within",
        description: "Inspiring talk by renowned youth advocate and entrepreneur."
      },
      {
        time: "Day 1, 1:00 PM",
        title: "Workshop: Public Speaking",
        description: "Develop confidence and skills in effective communication."
      },
      {
        time: "Day 2, 10:00 AM",
        title: "Panel: Young Changemakers",
        description: "Hear from successful young leaders making a difference."
      },
      {
        time: "Day 3, 2:00 PM",
        title: "Action Planning Session",
        description: "Develop a personal leadership action plan to implement in your community."
      }
    ]
  },
  {
    id: "event-6",
    title: "Community Health & Wellness Day",
    subtitle: "Healthy Living for All",
    description: "A free event offering health screenings, fitness classes, nutrition education, and wellness resources. Promoting healthy living and accessible healthcare for everyone in our community.",
    date: "March 8, 2024",
    time: "8:00 AM - 3:00 PM",
    location: "Memorial Park, Austin",
    imageUrl: "https://images.pexels.com/photos/6551144/pexels-photo-6551144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "8:00 AM",
        title: "Morning Yoga in the Park",
        description: "Start your day with a rejuvenating yoga session for all levels."
      },
      {
        time: "10:00 AM",
        title: "Health Screenings Begin",
        description: "Free blood pressure, diabetes, and basic health screenings."
      },
      {
        time: "12:00 PM",
        title: "Cooking Demonstration",
        description: "Learn to prepare quick, nutritious meals on a budget."
      },
      {
        time: "2:00 PM",
        title: "Family Fitness Challenge",
        description: "Fun, inclusive activities for families to enjoy together."
      }
    ]
  },
  {
    id: "event-7",
    title: "Cultural Heritage Festival",
    subtitle: "Celebrating Diversity",
    description: "A vibrant celebration of our community's diverse cultural heritage featuring traditional music, dance, food, and art from around the world. An opportunity to learn, appreciate, and connect across cultures.",
    date: "April 22-23, 2024",
    time: "11:00 AM - 8:00 PM",
    location: "Downtown Plaza, Miami",
    imageUrl: "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "11:00 AM",
        title: "Opening Parade",
        description: "Traditional costumes and performances from diverse cultures."
      },
      {
        time: "12:30 PM",
        title: "International Food Court Opens",
        description: "Sample authentic cuisine from over 20 countries."
      },
      {
        time: "2:00 PM",
        title: "Cultural Performances",
        description: "Traditional music and dance showcases on the main stage."
      },
      {
        time: "5:00 PM",
        title: "Global Artisan Market",
        description: "Handcrafted items, textiles, and art from around the world."
      }
    ]
  },
  {
    id: "event-8",
    title: "Innovation & Technology Expo",
    subtitle: "Future Forward",
    description: "Explore cutting-edge technology innovations and their potential impact on society. Features interactive exhibits, demonstrations, and talks by industry leaders in AI, renewable energy, biotechnology, and more.",
    date: "May 15, 2024",
    time: "10:00 AM - 6:00 PM",
    location: "Convention Center, Denver",
    imageUrl: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    scheduleItems: [
      {
        time: "10:00 AM",
        title: "Expo Floor Opens",
        description: "Interactive exhibits from leading tech companies and startups."
      },
      {
        time: "11:30 AM",
        title: "Keynote: AI and Human Potential",
        description: "Visionary talk on how AI can enhance human capabilities."
      },
      {
        time: "2:00 PM",
        title: "Panel: Ethical Technology",
        description: "Industry leaders discuss responsible innovation and ethical challenges."
      },
      {
        time: "4:00 PM",
        title: "Startup Showcase",
        description: "Emerging tech ventures present their innovative solutions."
      }
    ]
  }
];

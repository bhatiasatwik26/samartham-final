import { useState, useEffect } from "react";
import { Report, Event, EventDetail } from "@/types/report";

// Dummy report data
const dummyReports: Report[] = [
  { eventname: "Tech Meetup", volunteer: 35, participant: 120 },
  { eventname: "Charity Run", volunteer: 50, participant: 200 },
  { eventname: "Blood Donation Camp", volunteer: 40, participant: 150 },
  { eventname: "Tree Plantation Drive", volunteer: 30, participant: 100 },
  { eventname: "Coding Hackathon", volunteer: 45, participant: 180 },
  { eventname: "Health Camp", volunteer: 25, participant: 90 },
];

// Event data
const eventData: Event[] = [
  {
    eventid: "EVT001",
    eventname: "Charity Walkathon",
    eventdate: "2025-04-15",
    eventparticipant: 150,
    eventvolunteer: 30,
    eventimage:
      "https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    eventid: "EVT002",
    eventname: "Tech Innovation Workshop",
    eventdate: "2025-05-10",
    eventparticipant: 200,
    eventvolunteer: 40,
    eventimage:
      "https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  // {
  //   eventid: "EVT003",
  //   eventname: "Blood Donation Camp",
  //   eventdate: "2025-06-05",
  //   eventparticipant: 120,
  //   eventvolunteer: 25,
  //   eventimage: "https://via.placeholder.com/300x200?text=Blood+Donation",
  // },
  {
    eventid: "EVT004",
    eventname: "Tree Plantation Drive",
    eventdate: "2025-07-20",
    eventparticipant: 180,
    eventvolunteer: 35,
    eventimage:
      "https://images.pexels.com/photos/5748516/pexels-photo-5748516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    eventid: "EVT005",
    eventname: "Coding Hackathon",
    eventdate: "2025-08-15",
    eventparticipant: 300,
    eventvolunteer: 50,
    eventimage:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    eventid: "EVT006",
    eventname: "Health Awareness Seminar",
    eventdate: "2025-09-10",
    eventparticipant: 100,
    eventvolunteer: 20,
    eventimage:
      "https://images.pexels.com/photos/6551144/pexels-photo-6551144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    eventid: "EVT007",
    eventname: "Art and Craft Exhibition",
    eventdate: "2025-10-05",
    eventparticipant: 250,
    eventvolunteer: 45,
    eventimage:
      "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    eventid: "EVT008",
    eventname: "Music Festival",
    eventdate: "2025-11-12",
    eventparticipant: 400,
    eventvolunteer: 60,
    eventimage:
      "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  // {
  //   eventid: "EVT009",
  //   eventname: "Sports Championship",
  //   eventdate: "2025-12-18",
  //   eventparticipant: 350,
  //   eventvolunteer: 55,
  //   eventimage: "https://via.placeholder.com/300x200?text=Sports+Championship",
  // },
  {
    eventid: "EVT010",
    eventname: "Career Fair",
    eventdate: "2026-01-25",
    eventparticipant: 220,
    eventvolunteer: 30,
    eventimage:
      "https://images.pexels.com/photos/7648476/pexels-photo-7648476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

// Event details data
export const eventDetailsData: EventDetail[] = [
  {
    eventid: "EVT001",
    volunteerno: 30,
    participantno: 150,
    review: {
      noOfstar: 4.5,
      review:
        "The event was well-organized and enjoyable. Looking forward to the next one!",
    },
    ratingDistribution: {
      five: 80,
      four: 50,
      three: 15,
      two: 5,
      one: 0,
    },
  },
  {
    eventid: "EVT002",
    volunteerno: 40,
    participantno: 200,
    review: {
      noOfstar: 4.0,
      review:
        "Informative workshop with great speakers. Could use better seating arrangements.",
    },
    ratingDistribution: {
      five: 100,
      four: 60,
      three: 30,
      two: 10,
      one: 0,
    },
  },
  {
    eventid: "EVT003",
    volunteerno: 25,
    participantno: 120,
    review: {
      noOfstar: 5.0,
      review: "Excellent initiative! Very well executed and impactful.",
    },
    ratingDistribution: {
      five: 110,
      four: 10,
      three: 0,
      two: 0,
      one: 0,
    },
  },
  {
    eventid: "EVT004",
    volunteerno: 35,
    participantno: 180,
    review: {
      noOfstar: 3.8,
      review: "Good event but lacked enough volunteers for crowd management.",
    },
    ratingDistribution: {
      five: 60,
      four: 80,
      three: 30,
      two: 10,
      one: 0,
    },
  },
  {
    eventid: "EVT005",
    volunteerno: 50,
    participantno: 300,
    review: {
      noOfstar: 4.7,
      review: "The hackathon was intense and fun. Great experience!",
    },
    ratingDistribution: {
      five: 200,
      four: 80,
      three: 15,
      two: 5,
      one: 0,
    },
  },
  {
    eventid: "EVT006",
    volunteerno: 20,
    participantno: 100,
    review: {
      noOfstar: 4.2,
      review: "Informative and engaging seminar. Would recommend.",
    },
    ratingDistribution: {
      five: 40,
      four: 50,
      three: 10,
      two: 0,
      one: 0,
    },
  },
  {
    eventid: "EVT007",
    volunteerno: 45,
    participantno: 250,
    review: {
      noOfstar: 4.9,
      review: "The art exhibition was fantastic with creative pieces.",
    },
    ratingDistribution: {
      five: 200,
      four: 40,
      three: 10,
      two: 0,
      one: 0,
    },
  },
  {
    eventid: "EVT008",
    volunteerno: 60,
    participantno: 400,
    review: {
      noOfstar: 5.0,
      review: "Amazing festival with great music and vibes!",
    },
    ratingDistribution: {
      five: 350,
      four: 50,
      three: 0,
      two: 0,
      one: 0,
    },
  },
  {
    eventid: "EVT009",
    volunteerno: 55,
    participantno: 350,
    review: {
      noOfstar: 4.3,
      review: "Exciting sports championship with good participation.",
    },
    ratingDistribution: {
      five: 150,
      four: 150,
      three: 40,
      two: 10,
      one: 0,
    },
  },
  {
    eventid: "EVT010",
    volunteerno: 30,
    participantno: 220,
    review: {
      noOfstar: 4.6,
      review: "Career fair had excellent networking opportunities.",
    },
    ratingDistribution: {
      five: 150,
      four: 50,
      three: 20,
      two: 0,
      one: 0,
    },
  },
];

export const useReportData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventDetails, setEventDetails] = useState<EventDetail[]>([]);

  useEffect(() => {
    // Simulate API loading
    const loadData = () => {
      setTimeout(() => {
        setReports(dummyReports);
        setEvents(eventData);
        setEventDetails(eventDetailsData);
        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  return {
    isLoading,
    reports,
    events,
    eventDetails,
  };
};

import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types/event";

export const fetchEvents = async () => {
  const response = await fetch("http://localhost:3000/api/event"); // Replace with your backend URL

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return await response.json();
};

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

const fetchEventById = async (eventId: string): Promise<Event> => {
  const response = await fetch(`http://localhost:3000/api/event/${eventId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch event");
  }

  return response.json();
};

export const useEventById = (eventId: string) => {
  return useQuery<Event>({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventById(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

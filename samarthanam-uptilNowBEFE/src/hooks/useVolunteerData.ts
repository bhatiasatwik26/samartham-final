import { User, EventsSubscribed, Event } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

interface VolunteerData {
  user: User | null;
  subscribedEvents: EventsSubscribed[];
  isUserLoading: boolean;
  isUserError: boolean;
}
interface event {
  id: string;
  name: string;
}

// Fetch event details to get event name
const fetchEventDetails = async (eventId: string): Promise<event | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/event/${eventId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event data for ${eventId}`);
    }

    const eventData = await response.json();
    return {
      id: eventData._id || eventData.id,
      name: eventData.name,
      // Add other event properties as needed
    };
  } catch (error) {
    console.error(`Error fetching event data for ${eventId}:`, error);
    return null;
  }
};

// Fetch User Data Function
const fetchUserData = async (
  id: string
): Promise<{
  user: User | null;
  subscribedEvents: EventsSubscribed[];
}> => {
  console.log("Fetching data for ID:", id);
  try {
    const response = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    const user: User = {
      id: data._id,
      photo: data.photo,
      email: data.email,
      name: data.name,
      rank: data.rank,
      eventsVolunteered: data.eventsVolunteered ?? 0,
      volunteerHour: data.volunteerHour ?? 0,
      pointsForNextRank: data.pointsForNextRank ?? 0,
      currentPoints: data.currPoints ?? 0,
      nextRank: data.nextRank ?? "",
      eventsParticipated: data.eventsParticipated ?? 0,
      eventsSubscribed: (data.eventsSubscribed || []).map((event: any) => ({
        eventId: event.eventId,
        assignedTasks: (event.assignedTasks || []).map((task: any) => ({
          name: task.name,
          status: task.status,
          deadline: task.deadline ? new Date(task.deadline) : undefined,
        })),
      })),
      heatmapActivity: (data.heatmapActivity || []).map((activity: any) => ({
        date: new Date(activity.date),
        count: activity.count ?? 0,
      })),
    };

    // Fetch event names for each subscribed event
    const subscribedEventsWithNames = await Promise.all(
      user.eventsSubscribed.map(async (event) => {
        const eventDetails = await fetchEventDetails(event.eventId);
        return {
          ...event,
          eventName: eventDetails?.name || "Unknown Event",
        };
      })
    );

    return {
      user: {
        ...user,
        eventsSubscribed: subscribedEventsWithNames,
      },
      subscribedEvents: subscribedEventsWithNames,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { user: null, subscribedEvents: [] };
  }
};

// Custom Hook with Proper Types and Loading/Error Handling
export const useVolunteerData = (id: string): VolunteerData => {
  const {
    data,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<{
    user: User | null;
    subscribedEvents: EventsSubscribed[];
  }>({
    queryKey: ["userData", id], // Use id as part of the key to avoid caching issues
    queryFn: () => fetchUserData(id), // Pass the function reference, not the result
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry twice on failure
  });

  return {
    user: data?.user ?? null,
    subscribedEvents: data?.subscribedEvents ?? [],
    isUserLoading,
    isUserError,
  };
};

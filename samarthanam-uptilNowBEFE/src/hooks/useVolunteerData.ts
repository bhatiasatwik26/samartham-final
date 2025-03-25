import { User, EventsSubscribed } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

interface VolunteerData {
  user: User | null;
  subscribedEvents: EventsSubscribed[];
  isUserLoading: boolean;
  isUserError: boolean;
}

// ✅ Fetch User Data Function
const fetchUserData = async (): Promise<{
  user: User | null;
  subscribedEvents: EventsSubscribed[];
}> => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/user/67e0eec080a452dbf9288b50",
      {
        method: "GET",
        credentials: "include",
      }
    );

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

    return {
      user,
      subscribedEvents: user.eventsSubscribed,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { user: null, subscribedEvents: [] };
  }
};

// ✅ Custom Hook with Proper Types and Loading/Error Handling
export const useVolunteerData = (): VolunteerData => {
  const {
    data,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery<{
    user: User | null;
    subscribedEvents: EventsSubscribed[];
  }>({
    queryKey: ["userData"],
    queryFn: fetchUserData,
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

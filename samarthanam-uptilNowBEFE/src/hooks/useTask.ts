import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { User, EventsSubscribed } from "@/types/user";
const updateTaskStatus = async ({ userId, eventId, taskName, status }) => {
  const response = await fetch(
    "http://localhost:3000/api/user/update-task-status",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, eventId, taskName, status }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update task status");
  }

  return response.json();
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,

    onSuccess: (updatedTask, variables) => {
      toast({
        title: "Success",
        description: "Task status updated successfully",
        variant: "default",
      });

      // Optimistically update the userData cache
      queryClient.setQueryData<{
        user: User["user"];
        subscribedEvents: EventsSubscribed[];
      }>(["userData"], (oldData) => {
        if (!oldData) return oldData;

        // Map through the subscribedEvents and update the task status
        const updatedEvents = oldData.subscribedEvents.map((event) => {
          if (event.eventId === variables.eventId) {
            const updatedTasks = event.assignedTasks.map((task) =>
              task.name === variables.taskName
                ? { ...task, status: updatedTask.status }
                : task
            );

            return { ...event, assignedTasks: updatedTasks };
          }
          return event;
        });

        return { ...oldData, subscribedEvents: updatedEvents };
      });

      // Invalidate to refetch the latest data in the background
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      });
    },
  });
};

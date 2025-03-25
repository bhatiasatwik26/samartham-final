import React, { useState } from "react";
import { Check, Clock } from "lucide-react";
import { EventsSubscribed } from "@/types/user";
import { useUpdateTask } from "@/hooks/useTask";

interface Task {
  id: string;
  name: string;
  deadline: string;
  status: "completed" | "pending";
}

interface RegisteredEvent {
  id: string;
  title: string;
  tasks: Task[];
}

interface RegisteredEventsSectionProps {
  events: RegisteredEvent[];
  onTaskStatusChange: (
    eventId: string,
    taskId: string,
    isCompleted: boolean
  ) => void;
}

export const RegisteredEventsSection = ({
  events,
  userID,
}: {
  events: EventsSubscribed[];
  userID: string;
}) => {
  const date = new Date();
  const { mutate: updateTask } = useUpdateTask();

  const handleStatusChange = (
    taskName: string,
    eventId: string,
    status: string
  ) => {
    updateTask({
      userId: userID,
      eventId,
      taskName,
      status: status === "pending" ? "completed" : "pending",
    });
  };
  if (!events || events.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Registered Events
        </h3>
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">
            You haven't registered for any events yet.
          </p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Find Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
        Registered Events
      </h3>

      {events.map((event) => {
        // Calculate completion percentage
        const totalTasks = event.assignedTasks.length;
        const completedTasks = event.assignedTasks.filter(
          (task) => task.status === "completed"
        ).length;
        const completionPercentage =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return (
          <div
            key={event.eventId}
            className="bg-red-50 dark:bg-red-900/5 rounded-2xl p-5 mb-6 border border-red-100 dark:border-red-900/20"
          >
            <h4 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">
              {event.eventId}
            </h4>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  {completionPercentage}% Completed
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-green-500 dark:bg-green-500 rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {event.assignedTasks.map((task) => (
                <div
                  key={task.name}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all 
                    ${
                      task.status === "completed"
                        ? "bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30"
                        : "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
                    }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`task-${task.name}`}
                      checked={task.status === "completed"}
                      onChange={(e) =>
                        handleStatusChange(
                          task.name,
                          event.eventId,
                          task.status
                        )
                      }
                      className="w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`task-${task.name}`}
                      className={`ml-3 cursor-pointer ${
                        task.status === "completed"
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {task.name}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`text-sm ${
                        task.status === "completed"
                          ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                          : "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30"
                      } 
                      px-3 py-1 rounded-full flex items-center`}
                    >
                      {task.status === "completed" ? (
                        <>
                          <Check className="w-3 h-3 mr-1" /> Completed
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </>
                      )}
                    </span>
                    {/* <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                      {date.toLocaleDateString(task?.deadline)}
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

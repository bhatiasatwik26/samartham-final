import React from "react";
import { Check, Clock, Activity, Calendar } from "lucide-react";
import { EventsSubscribed } from "@/types/user";

// interface Task {
//   id: string;
//   name: string;
//   deadline: string;
//   status: "completed" | "pending";
// }

// interface RegisteredEvent {
//   id: string;
//   title: string;
//   tasks: Task[];
// }

// interface TaskSummaryProps {
//   events: RegisteredEvent[];
// }

export const TaskSummary = ({ events }: { events: EventsSubscribed[] }) => {
  const eventsCount = events ? events.length : 0;
  console.log(events);

  const calculateTaskStats = (events: EventsSubscribed[] = []) => {
    let pendingTasks = 0;
    let completedTasks = 0;

    for (const event of events) {
      const tasks = event.assignedTasks ?? [];

      for (const task of tasks) {
        if (task.status === "pending") {
          pendingTasks++;
        } else if (task.status === "completed") {
          completedTasks++;
        }
      }
    }

    const totalTasks = pendingTasks + completedTasks;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { pendingTasks, completedTasks, totalTasks, completionRate };
  };

  const { pendingTasks, completedTasks, totalTasks, completionRate } =
    calculateTaskStats(events);
  console.log("Pending Tasks:", pendingTasks); // e.g., 2
  console.log("Completed Tasks:", completedTasks); // e.g., 2
  console.log("Total Tasks:", totalTasks); // e.g., 4
  console.log("Completion Rate:", completionRate, "%");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        Task Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Events Participated
              </h4>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {eventsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
          <div className="flex items-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
              <Activity className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </h4>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </h4>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </h4>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {pendingTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">
            Overall Completion
          </span>
          <span className="font-medium text-gray-800 dark:text-white">
            {completionRate}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-2 bg-red-600 dark:bg-red-500 rounded-full"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

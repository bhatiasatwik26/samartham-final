import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface EventCardProps {
  event: any;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Use the card to display real events from events.ts
  if (event.title) {
    // This is a real event from events.ts
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-full">
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
          />
        </div>
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{event.title}</h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {event.date}
            </span>
          </div>
          
          <div className="flex-grow">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
              {event.description}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              to={`/events/${event.id}`}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center justify-center"
            >
              View Event Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    // This is the original mock event format
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-full">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{event.name}</h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {event.tasks.length} Tasks
            </span>
          </div>
          
          <div className="flex-grow">
            <ul className="space-y-2 mb-4">
              {event.tasks.map((task, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-4 h-4 mt-1 rounded-full ${task.status === 'pending' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                  <div className="ml-2">
                    <p className="text-gray-700 dark:text-gray-300">{task.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.deadline}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              to={`/events/${event.id}`}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center justify-center"
            >
              View Event Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}; 
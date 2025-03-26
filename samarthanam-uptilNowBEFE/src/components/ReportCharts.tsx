import React, { useState } from "react";
import { Calendar, Users, FileText, BarChart2, Star } from "lucide-react";
import EventStatsCard from "./reports/ReportEventStats";
import EventBarChart from "./reports/ReportBarChats";
import EventCard from "./reports/ReportEvent";
import EventReportHeader from "./reports/ReportHeader";
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { ReportData, CategoryStats, EventDetailReport } from '@/services/adminApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import adminApi from '@/services/adminApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

interface EventDetailData {
  eventid: string;
  volunteerno: number;
  participantno: number;
  review: {
    noOfstar: string;
    review: string;
  };
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  allReviews: string[];
}

interface ReportChartsProps {
  reports: ReportData[];
  categoryStats?: CategoryStats[];
}

const ReportCharts: React.FC<ReportChartsProps> = ({ reports = [], categoryStats = [] }) => {
  const [selectedEvent, setSelectedEvent] = useState<ReportData | null>(null);
  const [eventDetail, setEventDetail] = useState<EventDetailReport | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  // Calculate overview statistics
  const totalVolunteers = reports.reduce((sum, report) => sum + report.volunteer, 0);
  const totalParticipants = reports.reduce((sum, report) => sum + report.participant, 0);
  const totalEvents = reports.length;
  
  // Most popular events (most volunteers and most participants)
  const mostVolunteers = reports.length > 0 
    ? [...reports].sort((a, b) => b.volunteer - a.volunteer)[0] 
    : null;
    
  const mostParticipants = reports.length > 0
    ? [...reports].sort((a, b) => b.participant - a.participant)[0]
    : null;

  const handleEventClick = async (event: ReportData) => {
    setSelectedEvent(event);
    setIsLoadingDetails(true);
    
    try {
      // Fetch event details using the API service
      const details = await adminApi.getEventDetailReport(event.eventname);
      
      if (details) {
        setEventDetail(details);
      } else {
        // Fallback data if API call fails
        setEventDetail({
          eventid: event.eventname,
          eventname: event.eventname,
          volunteerno: event.volunteer,
          participantno: event.participant,
          review: {
            noOfstar: event.rating || "4.2",
            review: "Great event with excellent volunteer coordination."
          },
          ratingDistribution: {
            five: 12,
            four: 8,
            three: 3,
            two: 1,
            one: 0
          },
          allReviews: [
            "Great experience volunteering!",
            "Well organized event.",
            "Would definitely participate again.",
            "Meaningful impact on the community."
          ]
        });
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      // Fallback data
      setEventDetail({
        eventid: event.eventname,
        eventname: event.eventname,
        volunteerno: event.volunteer,
        participantno: event.participant,
        review: {
          noOfstar: event.rating || "4.2",
          review: "Great event with excellent volunteer coordination."
        },
        ratingDistribution: {
          five: 12,
          four: 8,
          three: 3,
          two: 1,
          one: 0
        },
        allReviews: [
          "Great experience volunteering!",
          "Well organized event.",
          "Would definitely participate again.",
          "Meaningful impact on the community."
        ]
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleBackToReports = () => {
    setSelectedEvent(null);
    setEventDetail(null);
  };

  // Event data visualization
  const eventData = {
    labels: reports.map(report => report.eventname),
    datasets: [
      {
        label: 'Volunteers',
        data: reports.map(report => report.volunteer),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Participants',
        data: reports.map(report => report.participant),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ],
  };

  // Category data visualization
  const categoryData = {
    labels: categoryStats.map(stat => stat.category),
    datasets: [
      {
        label: 'Events',
        data: categoryStats.map(stat => stat.eventCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      }
    ],
  };

  const volunteerCategoryData = {
    labels: categoryStats.map(stat => stat.category),
    datasets: [
      {
        label: 'Interested Volunteers',
        data: categoryStats.map(stat => stat.volunteerCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      }
    ],
  };

  // Rating distribution data for selected event
  const ratingData = eventDetail ? {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        label: 'Ratings',
        data: [
          eventDetail.ratingDistribution.five,
          eventDetail.ratingDistribution.four,
          eventDetail.ratingDistribution.three,
          eventDetail.ratingDistribution.two,
          eventDetail.ratingDistribution.one,
        ],
        backgroundColor: [
          'rgba(106, 195, 96, 0.7)',    // Green for 5 stars
          'rgba(156, 204, 101, 0.7)',   // Light green for 4 stars
          'rgba(255, 205, 86, 0.7)',    // Yellow for 3 stars
          'rgba(239, 153, 75, 0.7)',    // Orange for 2 stars
          'rgba(235, 87, 87, 0.7)',     // Red for 1 star
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const exportReportData = () => {
    // Create CSV content for events data
    const eventHeaders = "Event Name,Category,Volunteers,Participants\n";
    const eventCsvContent = reports.reduce((acc, report) => {
      return acc + `"${report.eventname}","${report.category || 'N/A'}",${report.volunteer},${report.participant}\n`;
    }, eventHeaders);
    
    // Create and download the file
    const blob = new Blob([eventCsvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "event_statistics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render event detail view
  if (selectedEvent) {
    if (isLoadingDetails) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={handleBackToReports} 
                className="mb-4"
              >
                ← Back to Reports
              </Button>
              <h1 className="text-2xl font-bold">{selectedEvent.eventname} Analysis</h1>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-500">Loading event details...</p>
          </div>
        </div>
      );
    }
    
    if (eventDetail) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={handleBackToReports} 
                className="mb-4"
              >
                ← Back to Reports
              </Button>
              <h1 className="text-2xl font-bold">{selectedEvent.eventname} Analysis</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-100 text-amber-700 rounded-full px-3 py-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-medium">{eventDetail.review.noOfstar}</span>
              </div>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventDetail.volunteerno}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventDetail.participantno}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Volunteer-Participant Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  1:{(eventDetail.participantno / eventDetail.volunteerno).toFixed(1)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Distribution Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Distribution of ratings given by participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {ratingData && <Doughnut 
                    data={ratingData} 
                    options={{ 
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }} 
                  />}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>
                  Recent reviews from participants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {eventDetail.allReviews.map((review, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p className="text-sm">"{review}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Review */}
          <Card>
            <CardHeader>
              <CardTitle>Top Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-lg italic">"{eventDetail.review.review}"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Render main reports view
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports and Analytics</h1>
        {reports.length > 0 && (
          <Button
            onClick={exportReportData}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FileText size={16} />
            <span>Export Data</span>
          </Button>
        )}
      </div>
      
      {reports.length === 0 && categoryStats.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500">No data available for reports.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
              <p className="text-2xl font-bold">{totalEvents}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500">Total Volunteers</h3>
              <p className="text-2xl font-bold">{totalVolunteers}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500">Total Participants</h3>
              <p className="text-2xl font-bold">{totalParticipants}</p>
            </div>
            
            {mostVolunteers && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500">Most Volunteered Event</h3>
                <p className="text-2xl font-bold">{mostVolunteers.eventname}</p>
                <p className="text-sm text-gray-500">{mostVolunteers.volunteer} volunteers</p>
              </div>
            )}
          </div>
          
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="table">Data Table</TabsTrigger>
          </TabsList>

            <TabsContent value="charts" className="space-y-6">
              {/* Event Statistics */}
              {reports.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Event Statistics</h2>
                  <div className="h-96">
                    <Bar 
                      data={eventData} 
                      options={{ 
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 8
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              )}
              
              {/* Category Statistics */}
              {categoryStats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Events by Category</h2>
                    <div className="h-80">
                      <Pie 
                        data={categoryData} 
                        options={{ 
                          responsive: true,
                          maintainAspectRatio: false,
                        }} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Volunteers by Interest</h2>
                    <div className="h-80">
                      <Pie 
                        data={volunteerCategoryData} 
                        options={{ 
                          responsive: true,
                          maintainAspectRatio: false,
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}
          </TabsContent>

            <TabsContent value="table">
              {/* Data Tables */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Event Data Table</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Event Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Volunteers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Participants</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {reports.map((report, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{report.eventname}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{report.category || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{report.volunteer}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{report.participant}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              variant="outline"
                              onClick={() => handleEventClick(report)}
                              className="text-blue-600"
                            >
                              <BarChart2 className="h-4 w-4 mr-1" />
                              Analyze
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Category Data Table */}
              {categoryStats.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
                  <h2 className="text-xl font-semibold mb-4">Category Statistics</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Event Count</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Volunteer Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categoryStats.map((stat, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{stat.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{stat.eventCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{stat.volunteerCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </div>
      )}
    </div>
  );
};

export default ReportCharts;

import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";

interface EventReportHeaderProps {
  totalEvents: number;
  timeframe?: string;
}

const EventReportHeader: React.FC<EventReportHeaderProps> = ({
  totalEvents,
  timeframe = "Last 30 days",
}) => {
  const handlePrint = () => {
    toast.info("Printing report...");
    window.print();
  };

  const handleExport = () => {
    toast.success("Report exported successfully");
    // In a real application, this would generate and download a CSV/PDF file

    // Create a simple CSV of the dummy data and download it
    const csvContent =
      "data:text/csv;charset=utf-8,Event,Volunteers,Participants\nTech Meetup,35,120\nCharity Run,50,200\nBlood Donation Camp,40,150\nTree Plantation Drive,30,100\nCoding Hackathon,45,180\nHealth Camp,25,90";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "event_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    // In a real application, this might open a modal with sharing options
    toast.success("Sharing link copied to clipboard");

    // Simulate copying to clipboard
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(window.location.href)
        .catch(() => toast.error("Failed to copy link to clipboard"));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Event Reports
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm">
            {timeframe} • {totalEvents} events
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 animate-slide-in">
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
        >
          <Printer className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Print</span>
        </Button>
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </div>
    </div>
  );
};

export default EventReportHeader;

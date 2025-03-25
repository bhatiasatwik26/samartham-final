import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Reports } from "@/types/report";

interface EventBarChartProps {
  data: Reports[];
  className?: string;
}

const EventBarChart: React.FC<EventBarChartProps> = ({ data, className }) => {
  const chartData = data.map((event) => ({
    name: event.eventName,
    Volunteers: event.volunteerCount,
    Participants: event.participantCount,
  }));
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Event Participation</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #f3f4f6",
                }}
              />
              <Legend />

              {/* Custom Colors */}
              <Bar
                dataKey="Volunteers"
                fill="#FF4D4D" // Red color for Volunteers
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="Participants"
                fill="#FF9999" // Light red color for Participants
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
export default EventBarChart;

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

interface EventData {
  eventname: string;
  volunteer: number;
  participant: number;
}

interface EventBarChartProps {
  data: EventData[];
  className?: string;
}

const EventBarChart: React.FC<EventBarChartProps> = ({ data, className }) => {
  const chartData = data.map((event) => ({
    name: event.eventname,
    Volunteers: event.volunteer,
    Participants: event.participant,
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
              <CartesianGrid strokeDasharray="3 3" stroke="#fee2e2" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
                stroke="#ef4444"
              />
              <YAxis stroke="#ef4444" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.1)",
                  border: "1px solid #fca5a5",
                }}
                cursor={{ fill: "#fee2e2", opacity: 0.2 }}
              />
              <Legend wrapperStyle={{ color: "#ef4444" }} />
              <Bar
                dataKey="Volunteers"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="Participants"
                fill="#fca5a5"
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

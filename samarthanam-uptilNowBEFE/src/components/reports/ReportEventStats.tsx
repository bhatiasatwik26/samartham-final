import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventStatsCardProps {
  title: string;
  value: number | string;
  className?: string;
  icon?: React.ReactNode;
}

const EventStatsCard = ({
  title,
  value,
  className,
  icon,
}: EventStatsCardProps) => {
  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-md animate-scale-in",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default EventStatsCard;

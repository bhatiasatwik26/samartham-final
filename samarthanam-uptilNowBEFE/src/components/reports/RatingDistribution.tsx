import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface RatingDistributionProps {
  details?: { [key: string]: number };
}

export const RatingDistribution = ({
  details = {},
}: RatingDistributionProps) => {
  const normalizedDistribution = {
    "1": Number(details["1"] ?? details[1] ?? 0),
    "2": Number(details["2"] ?? details[2] ?? 0),
    "3": Number(details["3"] ?? details[3] ?? 0),
    "4": Number(details["4"] ?? details[4] ?? 0),
    "5": Number(details["5"] ?? details[5] ?? 0),
  };

  const totalRatings = Object.values(normalizedDistribution).reduce(
    (acc, count) => acc + count,
    0
  );

  const getPercentage = (value: number) => {
    return totalRatings > 0 ? ((value / totalRatings) * 100).toFixed(1) : "0";
  };

  const ratingColors: { [key: string]: string } = {
    "5": "bg-green-500",
    "4": "bg-green-400",
    "3": "bg-yellow-400",
    "2": "bg-orange-400",
    "1": "bg-red-500",
  };

  const renderRatingBars = () =>
    Object.entries(normalizedDistribution)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([star, count]) => {
        const percentage = getPercentage(count);
        const color = ratingColors[star] || "bg-gray-300";

        return (
          <div key={star} className="flex items-center gap-2 mb-4">
            <div className="flex items-center w-20">
              <span className="font-medium text-gray-800">{star}</span>
              <Star
                className="h-4 w-4 text-yellow-400 ml-1"
                fill="currentColor"
              />
            </div>
            <div className="flex-1">
              <div className="h-4 w-full rounded-full overflow-hidden bg-gray-200">
                <div
                  className={`h-full transition-all duration-500 ${color}`}
                  style={{ width: `${parseFloat(percentage)}%` }}
                />
              </div>
            </div>
            <div className="w-20 text-right text-sm text-gray-600">
              <span>{count}</span>
              <span className="ml-1 text-xs">({percentage}%)</span>
            </div>
          </div>
        );
      });

  return (
    <Card className="bg-white shadow-md rounded-lg mt-6 transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Rating Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Based on {totalRatings} {totalRatings === 1 ? "review" : "reviews"}
        </div>
        {renderRatingBars()}
      </CardContent>
    </Card>
  );
};

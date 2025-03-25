import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventDetail } from "@/types/report";
import { Star } from "lucide-react";

interface RatingDistributionProps {
  details: EventDetail;
}

export const RatingDistribution = ({ details }: RatingDistributionProps) => {
  // Handle missing rating distribution gracefully
  if (!details?.ratingDistribution) return null;

  const { five, four, three, two, one } = details.ratingDistribution;
  const totalRatings = five + four + three + two + one;

  // Helper function to calculate percentage
  const getPercentage = (value: number) => {
    return totalRatings > 0 ? ((value / totalRatings) * 100).toFixed(1) : "0";
  };

  // Colors for each rating bar
  const ratingColors = {
    five: "bg-green-500",
    four: "bg-green-400",
    three: "bg-yellow-400",
    two: "bg-orange-400",
    one: "bg-red-500",
  };

  // Render rating bars
  const renderRatingBar = (
    count: number,
    stars: number,
    color: string,
    key: string
  ) => {
    const percentage = getPercentage(count);

    return (
      <div key={key} className="flex items-center gap-2 mb-4">
        <div className="flex items-center w-20">
          <span className="font-medium text-gray-800">{stars}</span>
          <Star className="h-4 w-4 text-yellow-400 ml-1" fill="currentColor" />
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
  };

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

        {renderRatingBar(five, 5, ratingColors.five, "five")}
        {renderRatingBar(four, 4, ratingColors.four, "four")}
        {renderRatingBar(three, 3, ratingColors.three, "three")}
        {renderRatingBar(two, 2, ratingColors.two, "two")}
        {renderRatingBar(one, 1, ratingColors.one, "one")}
      </CardContent>
    </Card>
  );
};

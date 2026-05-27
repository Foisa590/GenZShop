import { Star } from "lucide-react";

interface RatingProps { rating: number; size?: number; showCount?: boolean; count?: number; }

export function Rating({ rating, size = 16, showCount = false, count = 0 }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, i) => (<Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />))}
        {hasHalf && <Star size={size} className="text-yellow-400 fill-yellow-400 opacity-60" />}
        {Array.from({ length: emptyStars }).map((_, i) => (<Star key={`empty-${i}`} size={size} className="text-gray-300" />))}
      </div>
      {showCount && count > 0 && <span className="text-sm text-gray-500 ml-1">({count.toLocaleString()})</span>}
    </div>
  );
}

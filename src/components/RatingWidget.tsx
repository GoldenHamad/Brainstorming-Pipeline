import { useState } from 'react';
import { Star } from 'lucide-react';
import './RatingWidget.css';

interface RatingWidgetProps {
    rating: number;
    ratingCount?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRate?: (rating: number) => void;
    showCount?: boolean;
}

export function RatingWidget({
    rating,
    ratingCount = 0,
    size = 'md',
    interactive = false,
    onRate,
    showCount = true
}: RatingWidgetProps) {
    const [hoverRating, setHoverRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);

    const displayRating = hoverRating || rating;
    const starSizes = { sm: 14, md: 18, lg: 24 };
    const starSize = starSizes[size];

    const handleClick = (value: number) => {
        if (interactive && onRate && !hasRated) {
            onRate(value);
            setHasRated(true);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (interactive && !hasRated) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    return (
        <div className={`rating-widget rating-${size}`}>
            <div
                className={`rating-stars ${interactive && !hasRated ? 'interactive' : ''}`}
                onMouseLeave={handleMouseLeave}
                role={interactive ? 'radiogroup' : 'img'}
                aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
            >
                {[1, 2, 3, 4, 5].map((value) => {
                    const isFilled = value <= Math.floor(displayRating);
                    const isHalf = value === Math.ceil(displayRating) && displayRating % 1 >= 0.5;

                    return (
                        <button
                            key={value}
                            type="button"
                            className={`rating-star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
                            onClick={() => handleClick(value)}
                            onMouseEnter={() => handleMouseEnter(value)}
                            disabled={!interactive || hasRated}
                            aria-label={`Rate ${value} stars`}
                        >
                            <Star
                                size={starSize}
                                fill={isFilled || (hoverRating >= value) ? 'currentColor' : 'none'}
                                strokeWidth={2}
                            />
                        </button>
                    );
                })}
            </div>

            {showCount && (
                <span className="rating-info">
                    <span className="rating-value">{rating.toFixed(1)}</span>
                    {ratingCount > 0 && (
                        <span className="rating-count">({ratingCount.toLocaleString()})</span>
                    )}
                </span>
            )}

            {hasRated && (
                <span className="rating-thanks">Thanks for rating!</span>
            )}
        </div>
    );
}

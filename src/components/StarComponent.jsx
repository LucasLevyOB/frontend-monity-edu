import { useState } from 'react';
import { Box, HStack} from '@chakra-ui/react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  maxStars = 5, 
  initialRating = 0, 
  onRatingChange = () => {}, 
  size = "24px",
  readonly = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (starIndex) => {
    if (readonly) return;
    
    const newRating = starIndex + 1;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const handleMouseEnter = (starIndex) => {
    if (readonly) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const getStarColor = (starIndex) => {
    const currentRating = hoverRating || rating;
    if (starIndex < currentRating) {
      return '#F6D55C'
    }
    return '#CBD5E0';
  };

  return (
    <HStack spacing={1}>
      {[...Array(maxStars)].map((_, index) => (
        <Box
          key={index}
          as={Star}
          size={size}
          color={getStarColor(index)}
          fill={getStarColor(index)}
          cursor={readonly ? 'default' : 'pointer'}
          transition="all 0.2s"
          _hover={readonly ? {} : { 
            transform: 'scale(1.1)'
          }}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </HStack>
  );
};

export default StarRating;
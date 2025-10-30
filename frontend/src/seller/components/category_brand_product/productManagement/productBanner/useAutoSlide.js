import { useState, useEffect } from 'react';

export const useAutoSlide = (banners) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  useEffect(() => {
    if (banners.length > 1 && isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          // For desktop (md+), show 3 banners at once
          if (window.innerWidth >= 768) {
            return prevIndex >= banners.length - 3 ? 0 : prevIndex + 1;
          }
          // For mobile, show 1 banner at a time
          return prevIndex === banners.length - 1 ? 0 : prevIndex + 1;
        });
      }, window.innerWidth >= 768 ? 2000 : 3000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isAutoPlaying]);

  // Manual navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prevIndex => {
      if (window.innerWidth >= 768) {
        return prevIndex === 0 ? Math.max(banners.length - 3, 0) : prevIndex - 1;
      }
      return prevIndex === 0 ? banners.length - 1 : prevIndex - 1;
    });
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => {
      if (window.innerWidth >= 768) {
        return prevIndex >= banners.length - 3 ? 0 : prevIndex + 1;
      }
      return prevIndex === banners.length - 1 ? 0 : prevIndex + 1;
    });
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return {
    currentIndex,
    setCurrentIndex,
    isAutoPlaying,
    setIsAutoPlaying,
    goToPrevious,
    goToNext,
    goToSlide
  };
};
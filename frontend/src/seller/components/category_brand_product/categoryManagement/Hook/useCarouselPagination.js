import { useState, useEffect } from 'react';

export const useCarouselPagination = (categories, visible) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      let items;
      if (width < 480) items = visible ? 2 : 3;
      else if (width < 640) items = visible ? 3 : 4;
      else if (width < 768) items = visible ? 4 : 5;
      else if (width < 1024) items = visible ? 4 : 6;
      else if (width < 1280) items = visible ? 5 : 8;
      else if (width < 1536) items = visible ? 6 : 10;
      else items = visible ? 8 : 12;
      setItemsPerView(items);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [visible]);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerView));
  };

  const goToNext = () => {
    const maxIndex = Math.max(0, categories.length - itemsPerView);
    setCurrentIndex(prev => Math.min(maxIndex, prev + itemsPerView));
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerView < categories.length;

  return {
    currentIndex,
    setCurrentIndex,
    itemsPerView,
    goToPrevious,
    goToNext,
    canGoPrevious,
    canGoNext,
  };
};
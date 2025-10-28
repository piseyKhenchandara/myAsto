import React, { useEffect, useState } from 'react'
import { getCategoriesAPI } from '../../../api/CategoryProduct.api';

const CategoryScroll = () => {

  const [fetch, setfetch] = useState([]);
  const [current, setCurrent] = useState(0);
  
  const fetchCategory = async () => {
    try {
      const getCategories = await getCategoriesAPI();
      setfetch(getCategories);
    }
    catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  const preC = () => {
    setCurrent(prev => prev === 0 ? fetch.length - 1 : prev - 1);
  }

  const nextC = () => {
    setCurrent(prev => (prev + 1) % fetch.length);
  }

  const C = (index) => {
    setCurrent(index);
  }

  // Get 3 items to display (current item in the middle)
  const getVisibleItems = () => {
    if (fetch.length === 0) return [];
    if (fetch.length <= 3) return fetch.map((item, index) => ({ ...item, originalIndex: index }));

    const items = [];
    
    // Previous item
    const prevIndex = current === 0 ? fetch.length - 1 : current - 1;
    items.push({ ...fetch[prevIndex], originalIndex: prevIndex });
    
    // Current item
    items.push({ ...fetch[current], originalIndex: current });
    
    // Next item
    const nextIndex = (current + 1) % fetch.length;
    items.push({ ...fetch[nextIndex], originalIndex: nextIndex });
    
    return items;
  }

  const visibleItems = getVisibleItems();

  return (
    <nav className='flex justify-center items-center'>
      <button onClick={preC} className='cursor-pointer p-2'>
        <span>&lt;</span>
      </button>

      <div className='flex items-center'>
        {visibleItems.map((cat, displayIndex) => (
          <button key={cat.originalIndex} onClick={() => C(cat.originalIndex)}>
            <img 
              src={cat.image_url} 
              alt={cat.name || ""} 
              className={`w-10 h-10 mx-5 border-4 cursor-pointer object-cover rounded transition-all duration-300 ${
                cat.originalIndex === current 
                  ? "border-green-400 scale-110 opacity-100" 
                  : 'border-gray-400 opacity-60'
              }`}
            />
          </button>
        ))}
      </div>
      
      <button onClick={nextC} className='cursor-pointer p-2'>
        <span>&gt;</span>
      </button>
    </nav>
  )
}

export default CategoryScroll;
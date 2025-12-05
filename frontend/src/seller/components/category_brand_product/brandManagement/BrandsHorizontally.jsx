import React, { useEffect, useState } from 'react';
import { getAllBrandsAPI } from '../../../../api/BrandProduct.api';
import '../../../../index.css';

const BrandsHorizontally = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [brands, setBrands] = useState([]);

  const getBrands = async () => {
    try {
      setLoading(true);
      const response = await getAllBrandsAPI();
      setBrands(response.brands);
    } catch (error) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  if (loading) {
    return <p className="text-gray-300 text-center py-8">Loading brands...</p>;
  }

  if (msg.type === 'error') {
    return <p className="text-red-500 text-center py-8">{msg.text}</p>;
  }

  if (brands.length === 0) {
    return <p className="text-gray-500 text-center py-8">No brands available.</p>;
  }

  return (
    <section className="overflow-hidden w-full py-2 mb-5">
      <div className="flex animate-scroll items-center">
        {brands.map((b) => (
          <div className="brand-item flex-shrink-0 px-4" key={b.id}>
            <img
              src={b.image_url}
              alt={b.name || 'Brand'}
              className="brand-logo w-10 md:w-15"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandsHorizontally;
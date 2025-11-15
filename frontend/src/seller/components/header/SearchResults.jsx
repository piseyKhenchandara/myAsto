import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { getAllProduct } from '../../../api/Product.api';
import { useUser } from '../../../../context/UserContext';



const SearchResults = () => {

  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const searchQuery = searchParams.get('search_query');
  const searchTerm = location.state?.searchTerm || searchQuery;

  const {user: whoami} = useUser();

  const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';

  useEffect(() => { 
    if (searchTerm) {
      getAllProductsAndFilter();
    }
  }, [searchTerm]);

  const getAllProductsAndFilter = async () => {
    try {
      setLoading(true);
      setMsg({ type: '', text: '' });

      const response = await getAllProduct({ page: 1, limit: 100 });
      
      if (searchTerm && response.products) {
        const filtered = response.products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(response.products || []);
      }
    } catch (error) {
      setMsg({ 
        type: 'error', 
        text: error?.response?.data?.message || 'Failed to fetch products' 
      });
    } finally {
      setLoading(false);
    }
  };


  const handleBackToSearch = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-screen py-20">

      <section className="max-w-4xl mx-auto px-6 py-4">
        {/* Error Message */}
        {msg.type === 'error' && (
          <aside className="bg-green-100 border border-green-300 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error:</p>
            <p>{msg.text}</p>
          </aside>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            <p className="mt-4">Searching products...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <article 
                  key={product.id}
                  className="hover:bg-green-100 p-2 rounded-lg transition-colors"
                >
                  <Link 
                    to={checkUserRole 
                      ? `/dashboard/category/${product.Category?.slug}/brand/${product.Brand?.slug}/product/detail/${product.id}/${product.slug}` 
                      : `/category/${product.Category?.slug}/brand/${product.Brand?.slug}/product/detail/${product.id}/${product.slug}`
                    }
                    className="flex gap-4"
                  >
                    {/* Thumbnail */}
                    <figure className="flex-shrink-0">
                      <div className="w-40 h-24 bg-green-100 overflow-hidden relative">
                        {product.ProductImages ? (
                          <img 
                            src={product.ProductImages[0].image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                       
                      </div>
                    </figure>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm leading-tight mb-1 line-clamp-2 transition-colors">
                        {product.name}
                      </h5>
                      

                      <div className="text-xs ">
                       
                          <p className='pb-2'> ${parseFloat(product.price).toFixed(2)}</p>
                           <p className={`${product.stock.toLowerCase() === 'available' ? 'bg-green-200 text-black/50' : 'bg-yellow-400 text-white'} p-1 rounded-xl inline-block`}>{product.stock}</p>
                           <div className='overflow-hidden max-w-60'>
                            <span className='text-gray-500 line-clamp-1'>{product.description}</span>
                           </div>
                          
                       
                      </div>
                    </div>
                  </Link>
                </article>
              ))
            ) : (
              !loading && searchTerm && (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-2">
                      No results found
                    </h3>
                    
                    <p className="text-sm mb-6">
                      Try different keywords or remove search filters
                    </p>
                    
                    <button
                      onClick={handleBackToSearch}
                      className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition-colors text-sm"
                    >
                      Go back
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default SearchResults;
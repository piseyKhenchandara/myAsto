import React, { useEffect, useState } from 'react'
import { getProductDetail } from '../../../../api/Product.api';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../../customer/context/CartContext';
import { useUser } from '../../../../../context/UserContext';
import { FaCartArrowDown } from 'react-icons/fa6';

import ShareLinkToSocial from './ShareLinkToSocial';

const ProductDetail = () => {
    const [productDetail, setProductDetail] = useState(null);
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const {addToCart} = useCart();
    const {user : whoami} = useUser();

    const { id } = useParams();

    const fetchProductDetail = async () => {
        try {
            setLoad(true);
            setError('');
            const data = await getProductDetail(id);
            setProductDetail(data || null);
        }
        catch (error) {
            setError(error?.response?.data?.message || "Failed to fetch product detail");
        }
        finally {
            setLoad(false);
        }
    }

    useEffect(() => {
        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    if (load) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='flex items-center space-x-3'>
                    <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900'></div>
                    <span className='text-gray-600'>Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='text-center'>
                    <p className='text-red-600 mb-4'>{error}</p>
                    <button 
                        onClick={fetchProductDetail}
                        className='px-4 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors'
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!productDetail) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <p className='text-gray-500'>Product not found</p>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12'>
                
                {/* Image Section */}
                <div className='space-y-4'>
                    {/* Main Image */}
                    <div className='overflow-hidden'>
                        {selectedImage ? (
                            <img 
                                src={selectedImage.image_url} 
                                alt={productDetail.name}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            productDetail.ProductImages?.[0] ? (
                                <img 
                                    src={productDetail.ProductImages[0].image_url} 
                                    alt={productDetail.name}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center text-gray-400'>
                                    No image available
                                </div>
                            )
                        )}
                    </div>

                    {/* Thumbnail Grid */}
                    {productDetail.ProductImages?.length > 1 && (
                        <div className='grid grid-cols-4 gap-2'>
                            {productDetail.ProductImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImage?.image_url === img.image_url || 
                                        (!selectedImage && index === 0) 
                                            ? 'border-gray-900' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <img
                                        src={img.image_url}
                                        alt={`${productDetail.name} ${index + 1}`}
                                        className='w-full h-full object-cover'
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Videos */}
                    {productDetail.ProductVideos?.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Product Videos</h3>
                            <div className="space-y-3">
                                {productDetail.ProductVideos.map((video, index) => (
                                    <video 
                                        key={index}
                                        src={video.video_url}
                                        controls
                                        className="w-full rounded-lg"
                                        preload="metadata"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className='space-y-6'>
                    {/* Basic Info */}
                    <div className='space-y-2 border-b-1'>
                        <h3 className='text-2xl sm:text-3xl font-bold text-gray-900'>
                            {productDetail.name}
                        </h3>
                    </div>

                    {/* Description */}
                    {productDetail.description && (
                        <div className='prose prose-sm max-w-none'>
                            <p className='text-gray-600 leading-relaxed'>
                                {productDetail.description}
                            </p>
                        </div>
                    )}

                    {/* Features */}
                    {productDetail.ProductFeatures?.length > 0 && (
                        <div className='space-y-3'>
                            <h4 className=' text-gray-900 '>Specifications</h4>
                            <div className=''>
                                {productDetail.ProductFeatures.map((feature, index) => (
                                    <div key={index} className='px-4 py-3 flex justify-between border-b-1'>
                                        <span className='text-sm font-medium text-gray-900'>
                                            {feature.feature_name}
                                        </span>
                                        <span className='text-sm text-gray-600'>
                                            {feature.feature_value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Price and Warranty */}
                    <div className='flex flex-col space-y-2'>
                        <p>Price: <span className='font-bold text-green-600'>
                            ${productDetail.price}
                        </span></p>
                        
                        {productDetail.warranty && productDetail.warranty !== 'none' && (
                            <p>Warranty: <span className='font-semibold text-green-600'>
                                {productDetail.warranty}
                            </span></p>
                        )}
                    </div>

                    {whoami?.role === 'customer' && (
                        <button 
                            className="text-xs md:text-base font-bold text-white hover:bg-black cursor-pointer duration-200 ease-in-out border p-2 px-4 md:px-5 bg-green-500 rounded-[6px] flex items-center gap-1 min-w-[200px]"
                            onClick={() => addToCart(productDetail)}
                        >
                            <FaCartArrowDown /><span className='pl-5'>Add to Cart</span>
                        
                        </button>
                    )}
                    <ShareLinkToSocial productDetail={productDetail}/>
                    
                    

                    

                    

                    {/* Additional Info */}
                    <div className='space-y-3 pt-4 border-gray-200'>
                        <div className='flex items-center text-sm text-gray-600'>
                            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                            </svg>
                            Thanks you for supporting  
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
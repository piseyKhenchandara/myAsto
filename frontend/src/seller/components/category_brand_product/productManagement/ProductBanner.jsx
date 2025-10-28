import React, { useEffect, useState } from 'react'
import { IoIosAddCircleOutline } from 'react-icons/io';
import { getBannersByCategory, uploadBanner, deleteBannerAPI } from '../../../../api/ProductBanner.api';
import { Link, useParams } from 'react-router-dom';
import { GrNext } from "react-icons/gr";
import { MdArrowBackIos } from "react-icons/md";
import { CiTrash } from 'react-icons/ci';
import DeleteForm from '../DeleteForm'; // Import your DeleteForm component
import { useUser } from '../../../../../context/UserContext';
import DisplayFileNameSelected from '../../DisplayFileNameSelected';

const ProductBanner = () => {
    // Fixed: Change open to object structure from the start


    const {user : whoami, loading : loadingUserRole} = useUser();  
    const [open, setOpen] = useState({formName: '', open: false});
    const [productId, setProductId] = useState('');
    const [banners, setBanners] = useState([]);
    const [msg, setMsg] = useState({type: '', text: ''});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    

    const [selectedBannerId, setSelectedBannerId] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    
    const {category_slug, brand_slug} = useParams();


    const [submit, setSubmit] = useState({formName: '', process: false});
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    const getBannersByCate = async (category_slug) => {
        try{
            const data = await getBannersByCategory(category_slug);
            setBanners(data || []);
        }catch(error){
            setMsg({type: "error", text: error.response?.data.message || 'failed fetch banners'})
        }
    };

    useEffect(() => {
        getBannersByCate(category_slug);
    },[category_slug])


    // Auto-slide effect - 3s for mobile, 2s for desktop
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
            }, window.innerWidth >= 768 ? 2000 : 3000); // 2s for desktop, 3s for mobile

            return () => clearInterval(interval);
        }
    }, [banners.length, isAutoPlaying]);

    const resetForm = () => {
        setProductId('');
        setOpen({formName: '', open: false});
        setMsg({type: '', text: ''});
        setSubmit({formName: '', process: false});
        setFile(null);
        setProgress(0); // Reset progress too
    }

    const handleUpload = async(e) => {
        e.preventDefault();
        setMsg({type: '', text: ''});

        if(!productId || !file) {
            return setMsg({type: 'error', text: 'Please enter valid product ID and select a file!'});
        }
        try{
            setSubmit({formName: 'add', process: true});
            setProgress(0);
            await uploadBanner({
                category_slug, 
                productId,
                file,
                onProgress: evt => { // Fixed: correct parameter name
                    if(!evt.total) return;
                    const percentage = Math.round((evt.loaded * 100) / evt.total);
                    setProgress(percentage);
                }
            });
            setMsg({type: "success", text: 'Banner uploaded successfully! ✅'});

            getBannersByCate(category_slug);
            setTimeout(() => {
                resetForm();
            }, 3000)
            
        }catch(error){
            setMsg({type: 'error', text: error.response?.data.message || error.message});
            setTimeout(() => {
                resetForm();
            }, 3000)
        }
        finally{
            setSubmit({formName: '', process: false});
        }
    }

    // Fixed: Update to use object structure
    const handleOpenAdd = () => {
        setOpen({formName: 'add', open: true});
    }

    const deleteBan = async (id) => {
        try {
            setSubmit({formName: 'delete', process: true});
            await deleteBannerAPI(id);
            
            setMsg({type: 'success', text: 'Banner deleted successfully ✅'});
            // Fixed: Use correct function name
            await getBannersByCate(category_slug);

            setTimeout(() => {
                setOpen({formName: '', open: false});
                setSubmit({formName: '', process: false});
                setMsg({type: '', text: ''});
            }, 1500);
            
        } catch (error) {
            setMsg({
                type: 'error', 
                text: error.response?.data?.message || error.message
            });
        }
    }

    const handleOpenDelete = (banner) => {
        setSelectedBannerId(banner.id);
        setSelectedBanner(banner);
        setOpen({formName: 'delete', open: true});
    }

    const handleClose = () => {
        setOpen({formName: '', open: false});
        setProductId('');
        setFile(null);
        setMsg({type: '', text: ''});
        setProgress(0);
    }

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

    const checkUserRole = whoami?.role === 'admin' || whoami?.role === 'seller';

    return (
        <div className='overflow-x-hidden'>
            {loadingUserRole ? <p className='text-gray-300 text-center'>loading permission...</p> : 

            <>

                {checkUserRole && <div className='bg-gray-200 px-6'>
                    <div className="flex justify-between items-center md:w-[50%] py-1">
                        <h4 className="">Banners-section</h4>
                        <button 
                            className="rounded-[10px] flex items-center shadow-md shadow-green-400 cursor-pointer hover:text-white transition duration-200 bg-green-500 hover:bg-green-500 text-white py-1 px-3 gap-2" 
                            onClick={handleOpenAdd} // Fixed: use handleOpenAdd
                        >
                            Add
                            <IoIosAddCircleOutline className="text-2xl sm:text-3xl"/>
                        </button>
                    </div>
                </div>}
                {banners.length === 0 && (
                    <div className="text-center py-12 px-4">
                        <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className='text-gray-500 text-center font-medium'>
                                You have to add Product first before add Banner!
                            </p>
                            <p className='text-gray-400 text-sm mt-2'>
                                Create some products to start showcasing them with banners
                            </p>
                        </div>
                    </div>
                )}
                
                {banners.length > 0 && (
                <div className='relative w-full h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96 overflow-hidden bg-gray-100'>
                        {/* Banner Container */}
                    <div 
                        className='flex transition-transform duration-1000 ease-in-out h-full'
                        style={{ 
                            transform: `translateX(-${currentIndex * (window.innerWidth >= 768 ? (100/3) : 100)}%)`,
                        }}
                    >
                        {banners.map((b, index) => (
                            <div 
                                key={b.Product?.id || index} 
                                className='flex-shrink-0 relative md:w-1/3 w-full group'
                            >
                                <Link 
                                    className='block w-full h-full relative'
                                    to={checkUserRole ? `/dashboard/category/${category_slug}/brand/${brand_slug}/product/detail/${b.Product?.id}` : `/category/${category_slug}/brand/${brand_slug}/product/detail/${b.Product?.id}`}
                                >
                                    <img 
                                        src={b.image_url} 
                                        alt={b.Product?.name} 
                                        className='w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300'
                                        loading='lazy'
                                    />
                                    
                                    {/* Banner info overlay */}
                                    {checkUserRole && 
                                        <div>
                                            <div className='absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent text-white p-3 sm:p-4'>
                                                <p className='text-xs sm:text-sm mb-1'>
                                                    <span className='text-gray-300'>ID:</span> 
                                                    <span className='bg-white/20 px-2 py-1 rounded ml-1 font-mono'>{b.Product?.id}</span>
                                                </p>
                                                {b.Product?.name && (
                                                    <p className='text-sm sm:text-lg font-semibold line-clamp-2 leading-tight'>
                                                        {b.Product?.name}
                                                    </p>
                                                )}
                                            </div>

                                                {/* Delete button inside Link */}
                                            <button 
                                                className="absolute bottom-3 left-3 flex items-center cursor-pointer transition-all duration-200 py-1 px-2 text-xl sm:text-2xl text-red-400 z-30 bg-black/80" 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleOpenDelete(b);
                                                }}
                                            >
                                                <CiTrash/>
                                            </button>
                                            
                                                {/* Hover effect overlay */}
                                            <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center'>
                                                <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium'>
                                                    View Product
                                                </div>
                                            </div>
                                        </div>}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows - optimized for mobile */}
                    {banners.length > 1 && (
                        <>
                            <button 
                                onClick={goToPrevious}
                                className='absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 md:hidden'
                            >
                                <MdArrowBackIos className="text-lg sm:text-xl" />
                            </button>
                            <button 
                                onClick={goToNext}
                                className='absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 md:hidden'
                            >
                                <GrNext className="text-lg sm:text-xl" />
                            </button>
                        </>
                    )}

                    {/* Dot Indicators - optimized positioning */}
                    {banners.length > 1 && (
                        <div className='absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:hidden'>
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                                        index === currentIndex 
                                            ? 'bg-white scale-125 shadow-lg' 
                                            : 'bg-white/60 hover:bg-white/80'
                                    }`}
                                />
                            ))}   
                        </div>
                    )}

                        {/* Auto-play indicator - smaller and better positioned */}
                    <div className='absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs backdrop-blur-sm'>
                        <span className='md:hidden'>{currentIndex + 1} / {banners.length}</span>
                        <span className='hidden md:inline'>{Math.min(currentIndex + 3, banners.length)} / {banners.length}</span>
                        {isAutoPlaying && <span className='ml-1 sm:ml-2 text-green-400'>●</span>}
                        </div>

                        {/* Progress bar for auto-play - thinner for mobile */}
                        {banners.length > 1 && isAutoPlaying && (
                            <div className='absolute bottom-0 left-0 w-full h-0.5 sm:h-1 bg-white/20'>
                                <div 
                                    className='h-full bg-green-500 transition-all duration-75 ease-linear'
                                    style={{
                                        width: '100%',
                                        animation: `progress-bar ${window.innerWidth >= 768 ? '2s' : '3s'} linear infinite`
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                
                {/* Enhanced Modal - Fixed: check for add form */}
                {open.open && open.formName === 'add' && (
                    <div className='inset-0 fixed justify-center items-center bg-black/50 flex flex-col gap-5 z-50'>
                        <div className="bg-white rounded-[20px] shadow-lg shadow-green-600 p-4 sm:p-6 mx-4 md:max-w-[400px]">
                            <div className="flex justify-between items-center w-full">
                                <h4 className="text-lg font-semibold">Add Banner Image</h4>
                                <button 
                                    onClick={handleClose}
                                    className="text-gray-700 hover:text-gray-900 text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            {submit.process && submit.formName === 'add' && (
                                <div className="w-full mb-3">
                                    <div className="w-full h-2 bg-gray-200 rounded">
                                        <div
                                            className="h-2 rounded bg-green-600 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Uploading… {progress}%
                                    </div>
                                </div>
                            )}
                            
                            {msg.text && (
                                <p className={`${msg.type === "error" ? "text-red-500" : "text-green-500"}`}>
                                    {msg.text}
                                </p>
                            )}
                
                            <form onSubmit={handleUpload} className='flex flex-col gap-3'>
                                <p className='mt-5'>Image (Max 1)</p>
                                <div className='bg-gray-300 hover:bg-gray-400 border-dashed border relative flex flex-col justify-center items-center p-5 rounded-[15px] text-gray-700 cursor-pointer'>
                                    <IoIosAddCircleOutline className='text-4xl w-full' />
                                    <h5>Choose one image for one banner</h5>
                                    <p className='text-gray-500'>Accept: jpg, png, webp</p>
                                    <input 
                                        type="file"
                                        accept='image/*'
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className='absolute inset-0 opacity-0 cursor-pointer'
                                    />
                                </div>

                                <DisplayFileNameSelected fileName = {file? file.name : null}/>
                
                                <input 
                                    type="text"
                                    placeholder='Link to product ID, e.g: 65'
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="outline-none border-b-2 border-gray-300 focus:border-green-600 py-2" 
                                />     
                                
                                <div className="flex gap-2 mt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`flex-1 px-4 py-2 rounded-lg hover: transition duration-200 cursor-pointer ${
                                            submit.process && submit.formName === 'add' 
                                                ? 'bg-gray-300 text-gray-200' 
                                                : "bg-green-600 text-white"
                                        }`}
                                        disabled={submit.process && submit.formName === 'add'}
                                    >
                                        Add Image
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Form Modal */}
                {open.open && open.formName === 'delete' && (
                    <DeleteForm
                        setOpen={handleClose}
                        deleteCate={() => deleteBan(selectedBannerId)}
                        msg={msg}
                        name={selectedBanner?.Product?.name}
                        submit={submit.process && submit.formName === 'delete'}
                        typeData={selectedBanner}
                    />
                )}

                <style>{`
                    @keyframes progress-bar {
                        from { width: 0%; }
                        to { width: 100%; }
                    }
                `}</style>
            </>
            
            }
            
            

        </div>
    )
}

export default ProductBanner
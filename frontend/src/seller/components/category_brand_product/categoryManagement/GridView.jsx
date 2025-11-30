import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';
import asto_logo from '../../../../assets/logoes/asto_logo.png'

const GridView = ({ 
    categories, 
    visible, 
    handleOpenEdit, 
    handleOpenDelete,
    whoami,
    loadingUserRole
}) => {
    const [visibleCards, setVisibleCards] = useState(new Set());
    const cardRefs = useRef([]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const cardId = entry.target.dataset.cardId;
                
                if (entry.isIntersecting) {
                    setVisibleCards(prev => new Set([...prev, cardId]));
                } else {
                    setVisibleCards(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(cardId);
                        return newSet;
                    });
                }
            });
        }, observerOptions);

        cardRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [categories]);

    if (loadingUserRole) {
        return <div className="p-4 text-center">Loading permissions...</div>;
    }

    if (categories.length === 0) {
        return (
            <div className="px-6 py-4 w-full flex justify-center">
                <p className="text-center text-gray-500 py-8">No categories found.</p>
            </div>
        );
    }

    return (
        <section className="px-6 py-4 w-full flex flex-col items-center relative overflow-hidden">
            <style>
                {`
                    @keyframes gradientShift {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }

                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0) rotate(0deg);
                        }
                        50% {
                            transform: translateY(-20px) rotate(5deg);
                        }
                    }

                    .animated-background {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(
                            135deg,
                            #ffffff 0%,
                            #e8f5e9 25%,
                            #c8e6c9 50%,
                            #a5d6a7 75%,
                            #81c784 100%
                        );
                        background-size: 400% 400%;
                        animation: gradientShift 15s ease infinite;
                        z-index: -2;
                    }

                    .floating-shapes {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        z-index: -1;
                    }

                    .shape {
                        position: absolute;
                        opacity: 0.1;
                        animation: float 6s ease-in-out infinite;
                    }

                    .shape:nth-child(1) {
                        top: 10%;
                        left: 10%;
                        width: 80px;
                        height: 80px;
                        background: #4caf50;
                        border-radius: 50%;
                        animation-delay: 0s;
                    }

                    .shape:nth-child(2) {
                        top: 60%;
                        left: 80%;
                        width: 120px;
                        height: 120px;
                        background: #66bb6a;
                        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                        animation-delay: 2s;
                    }

                    .shape:nth-child(3) {
                        top: 30%;
                        left: 70%;
                        width: 100px;
                        height: 100px;
                        background: #81c784;
                        border-radius: 50%;
                        animation-delay: 4s;
                    }

                    .shape:nth-child(4) {
                        top: 70%;
                        left: 20%;
                        width: 90px;
                        height: 90px;
                        background: #a5d6a7;
                        border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
                        animation-delay: 1s;
                    }

                    .shape:nth-child(5) {
                        top: 20%;
                        left: 40%;
                        width: 110px;
                        height: 110px;
                        background: #4caf50;
                        border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
                        animation-delay: 3s;
                    }

                    .category-card {
                        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        z-index: 1;
                    }

                    .category-card.hidden-left {
                        opacity: 0;
                        transform: translateX(-150px);
                    }

                    .category-card.visible {
                        opacity: 1;
                        transform: translateX(0);
                    }

                    .category-card.hidden-right {
                        opacity: 0;
                        transform: translateX(150px);
                    }
                `}
            </style>

            {/* Animated Background */}
            <div className="animated-background"></div>
            
            {/* Floating Shapes */}
            <div className="floating-shapes">
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
                <div className="shape"></div>
            </div>

            <div className="w-full max-w-6xl relative z-10">
                {categories.map((cat, index) => (
                    <article 
                        ref={el => cardRefs.current[index] = el}
                        data-card-id={cat.id}
                        className={`category-card backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                            visibleCards.has(cat.id.toString()) ? 'visible' : 'hidden-left'
                        }`}
                        key={cat.id}
                    >
                        <div className="flex items-center p-2 sm:p-4 md:p-6 relative">
                            {/* Image and Text Section */}
                            <NavLink 
                                to={
                                    (whoami?.role === 'admin' || whoami?.role === 'seller')
                                    ? `/dashboard/category/${cat.slug}/brand/first/products`
                                    : `/category/${cat.slug}/brand/first/products`
                                }
                                className={`flex items-center bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-e-xl sm:rounded-e-2xl flex-shrink-0 ${
                                    (whoami?.role === 'admin' || whoami?.role === 'seller')
                                    ? 'w-[calc(100%-80px)] sm:w-[calc(100%-100px)] md:w-[calc(100%-120px)]'
                                    : 'w-full'
                                }`}
                            >
                                <img
                                    src={cat.image_url || asto_logo}
                                    alt={cat.name}
                                    className="w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain rounded-lg sm:rounded-xl hover:scale-105 transition-transform duration-300 flex-shrink-0"
                                />

                                {/* Category Name - Positioned vertically centered and to the right */}
                                <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 hover:text-green-600 transition-colors duration-200 ml-3 xs:ml-4 sm:ml-6 md:ml-8 lg:ml-10 leading-tight truncate">
                                    {cat.name}
                                </h3>
                            </NavLink>

                            {/* Action Buttons - Positioned on the far right */}
                            {(whoami?.role === 'admin' || whoami?.role === 'seller') && (
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                                    <button 
                                        className="p-1.5 sm:p-2 rounded-lg hover:bg-green-50 transition duration-200 text-xl sm:text-2xl md:text-3xl text-green-500 hover:scale-110 transform flex-shrink-0" 
                                        onClick={() => handleOpenEdit(cat)}
                                        aria-label="Edit category"
                                    >
                                        <CiEdit/>
                                    </button>

                                    <button 
                                        className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 transition duration-200 text-xl sm:text-2xl md:text-3xl text-red-500 hover:scale-110 transform flex-shrink-0" 
                                        onClick={() => handleOpenDelete(cat)}
                                        aria-label="Delete category"
                                    >
                                        <CiTrash/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default GridView;
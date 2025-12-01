import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';
import asto_logo from '../../../../assets/logoes/asto_logo.png';

const GridView = ({
    categories,
    visible,
    handleOpenEdit,
    handleOpenDelete,
    whoami,
    loadingUserRole
}) => {
    const cardRefs = useRef([]);

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
        <section className="px-6 py-4 w-full flex flex-col items-center relative">

            <div className="w-full max-w-6xl relative">
                {categories.map((cat, index) => (
                    <article
                        ref={el => (cardRefs.current[index] = el)}
                        data-card-id={cat.id}
                        className="category-card backdrop-blur-sm transition-all duration-300 overflow-hidden"
                        key={cat.id}
                    >
                        <div className="flex items-center p-2 sm:p-4 md:p-6">

                            <NavLink
                                to={
                                    whoami?.role === 'admin' || whoami?.role === 'seller'
                                        ? `/dashboard/category/${cat.slug}/brand/first/products`
                                        : `/category/${cat.slug}/brand/first/products`
                                }
                                className={`flex items-center bg-white shadow-lg p-3 sm:p-4 md:p-6 rounded-e-xl sm:rounded-e-2xl flex-shrink-0 ${
                                    whoami?.role === 'admin' || whoami?.role === 'seller'
                                        ? 'w-[calc(100%-80px)] sm:w-[calc(100%-100px)] md:w-[calc(100%-120px)]'
                                        : 'w-full'
                                }`}
                            >
                                <img
                                    src={cat.image_url || asto_logo}
                                    alt={cat.name}
                                    className="w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain rounded-lg sm:rounded-xl flex-shrink-0"
                                />

                                <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 ml-3 xs:ml-4 sm:ml-6 md:ml-8 lg:ml-10 leading-tight truncate">
                                    {cat.name}
                                </h3>
                            </NavLink>

                            {(whoami?.role === 'admin' || whoami?.role === 'seller') && (
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">

                                    <button
                                        className="p-1.5 sm:p-2 rounded-lg hover:bg-green-50 transition duration-200 text-xl sm:text-2xl md:text-3xl text-green-500 flex-shrink-0"
                                        onClick={() => handleOpenEdit(cat)}
                                        aria-label="Edit category"
                                    >
                                        <CiEdit />
                                    </button>

                                    <button
                                        className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 transition duration-200 text-xl sm:text-2xl md:text-3xl text-red-500 flex-shrink-0"
                                        onClick={() => handleOpenDelete(cat)}
                                        aria-label="Delete category"
                                    >
                                        <CiTrash />
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

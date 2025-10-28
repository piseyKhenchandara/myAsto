import React from 'react';
import { NavLink } from 'react-router-dom';
import { CiEdit, CiTrash } from 'react-icons/ci';
import asto_logo from '../../../../assets/logoes/asto_logo.png'

const GridView = ({ 
    categories, 
    visible, 
    handleOpenEdit, 
    handleOpenDelete,
    whoami,
    loadingUserRole   // 👈 Accept loadingUserRole prop
}) => {

    // ✅ Only show loader while context is loadingUserRole
    if (loadingUserRole) {
        return <div className="p-4 text-center">Loading permissions...</div>;
    }

    // ✅ Now render grid even for guests (whoami === null)
    if (categories.length === 0) {
        return (
            <div className="px-6 py-4 w-full flex justify-center">
                <p className="text-center text-gray-500 py-8">No categories found.</p>
            </div>
        );
    }

    return (
        <section className="px-6 py-4 w-full flex flex-col items-center">
            <div className={`grid justify-items-center ${
                visible 
                ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6' 
                : "grid-cols-3 md:grid-cols-5 lg:grid-cols-7"
            } gap-3 md:gap-6`}>
                {categories.map((cat) => (
                    <article 
                        className="rounded-[15px] flex flex-col items-center transition-all cursor-pointer hover:scale-110 transform duration-300 p-2 border min-w-[80px] md:min-w-[120px]" 
                        key={cat.id}
                    >
                        <NavLink 
                            to={
                                (whoami?.role === 'admin' || whoami?.role === 'seller')  // ✅ SAFE optional chaining
                                ? `/dashboard/category/${cat.slug}/brand/first/products`
                                : `/category/${cat.slug}/brand/first/products`
                            }
                            className="flex flex-col items-center w-full"
                        >
                            <img
                                src={cat.image_url || asto_logo}
                                alt={cat.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover mb-3 rounded-lg"
                            />
                        </NavLink>
                        
                        <span className="font-medium text-center text-xs sm:text-sm md:text-base text-gray-700 hover:text-green-600 transition-colors duration-200 truncate max-w-full">
                            {cat.name}
                        </span>

                        {/* ✅ Safe check — won't crash if whoami is null */}
                        {(whoami?.role === 'admin' || whoami?.role === 'seller') && (
                            <div className="flex justify-between w-full">
                                <button 
                                    className="rounded-[10px] flex items-center cursor-pointer transition duration-200 py-1 text-xl sm:text-2xl text-green-500" 
                                    onClick={() => handleOpenEdit(cat)}
                                >
                                    <CiEdit/>
                                </button>

                                <button 
                                    className="rounded-[10px] flex items-center cursor-pointer transition duration-200 py-1 text-xl sm:text-2xl text-red-500" 
                                    onClick={() => handleOpenDelete(cat)}
                                >
                                    <CiTrash/>
                                </button>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
};

export default GridView;
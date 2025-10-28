import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getAllProduct } from "../../../api/Product.api";

const SearchPopup = ({ toggleSearchPopup, searchPopup }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate();
  const [msg, setMsg] =useState({type : '', text : ""})
  const handleSearchSubmit = async () => {

    
    try {

      const data = await getAllProduct.get('/products');
      setAllProducts(data.products);

    }
    catch(error) {
      setMsg({type : 'error', text : error.response?.data.message || "failed fetching products"});

    }
    allProducts.map(p => {
      if(searchTerm.includes(p.name)) {
        navigate(`/products/detail/${p.id}`)
      }
    })

  }

  return (
    <>
      <button onClick={toggleSearchPopup} aria-label="Open search">
        <IoIosSearch className="cursor-pointer md:text-2xl" />
      </button>

      {searchPopup && (
        <aside className="fixed left-0 right-0 top-12 flex justify-center z-10">
          <section className="bg-white shadow-lg rounded-b-md p-4 w-full md:max-w-[1920px]">
            {/* 🔎 Input */}
            <form className="flex flex-row items-center gap-2 border-b pb-2">
              <IoIosSearch
                className="text-gray-400 text-base cursor-pointer"
                onClick={handleSearchSubmit}
              />
              <input
                type="text"
                className="w-full text-gray-600 focus:outline-none font-medium text-sm"
                placeholder="Search"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              />
            </form>

            {/* 🔽 Result List */}
            <div className="overflow-y-auto max-h-80 mt-2">
              
            </div>
          </section>
        </aside>
      )}
    </>
  );
};

export default SearchPopup;
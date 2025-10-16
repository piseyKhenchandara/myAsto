import React, { useState, useEffect } from 'react';
import { getAllWhoOrderedAPI } from '../../../api/order.api';
import OrdersTable from './OrdersTable';
import DisplayTheOrder from './displayTheOrder';


const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const fetchOrders = async () => {
    try {
      const response = await getAllWhoOrderedAPI(limit, page);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };



  return (
    <div className="container mx-auto text-xs p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-5 text-gray-800 flex items-center gap-2">
        📦 Order List
      </h2>

      {/* Limit Selector */}
      <div className="mb-5 flex items-center gap-2">
        <label className="font-medium text-gray-600">Items per page:</label>
        <select
          value={limit}
          onChange={(e) => handleLimitChange(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
        </select>
      </div>

      <OrdersTable
        orders={orders}
        page = {page}
        handlePageChange={handlePageChange}
        pagination={pagination}
        setOpen = {setOpen}
      />
      {open && 
        <div className='inset-0 fixed flex items-center justify-center bg-black/50 z-50'>
          <DisplayTheOrder orders = {orders} setOpen = {setOpen}/>

        </div>
      }
    </div>
  );
};

export default OrderList;

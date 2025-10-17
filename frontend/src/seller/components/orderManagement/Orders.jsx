import React, { useState, useEffect, use } from 'react';
import { getAllWhoOrderedAPI, getTheReceipt } from '../../../api/order.api';
import OrdersTable from './OrdersTable';
import OrderDetail from './orderDetail/OrderDetail';



const Orders = () => {
  
  const [orders, setOrders] = useState([]);
  const [theReceipt, setTheReceipt] =useState(null);
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

  const fetchTheReceipt = async (userId, orderNumber) => {
    setOpen(true);
    try{

      const response = await getTheReceipt(userId, orderNumber);
      setTheReceipt(response.data);
      console.log(response.data)
      

    }catch(error) {
      console.log('Error fetching orders : ', error);
    }
  }


  return (
    <div className=" w-full ">

      <div className=' text-xs py-5 '>
        
        <OrdersTable
                orders={orders}
                page = {page}
                handlePageChange={handlePageChange}
                pagination={pagination}
                setOpen={setOpen}
                fetchTheReceipt = {fetchTheReceipt}
              />
              {open && 
                <div className='inset-0 fixed flex items-center justify-center bg-black/50 z-50'>
                  <OrderDetail theReceipt = {theReceipt} setOpen = {setOpen} />

                </div>
              }
      </div>
      

      {/* Limit Selector */}
      {/* <div className="mb-5 flex items-center gap-2">
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
      </div> */}

      
    </div>
  );
};

export default Orders;

import React, { useState, useEffect } from 'react';
import { getAllWhoOrderedAPI, getTheReceipt, updateDeliveryCheckAPI } from '../../../api/order.api';
import OrdersTable from './ordersTable/OrdersTable';
import OrderDetail from './orderDetail/OrderDetail';

const Orders = () => {
  
  const [orders, setOrders] = useState([]);
  const [theReceipt, setTheReceipt] = useState(null);
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

  const fetchTheReceipt = async (userId, orderNumber) => {
    setOpen(true);
    try {
      const response = await getTheReceipt(userId, orderNumber);
      setTheReceipt(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Error fetching orders : ', error);
    }
  };

  const handleDeliveryToggle = async (orderId, isChecked) => {
    try {
      const response = await updateDeliveryCheckAPI(orderId, isChecked );
      
      if (response.success) {

        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, delivery_check: isChecked  }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update delivery status:', error.reponse?.data.message);
      
    }
  };

  return (
    <div className="w-full">
      <div className='text-xs py-5'>
        <OrdersTable
          orders={orders}
          page={page}
          handlePageChange={handlePageChange}
          pagination={pagination}
          setOpen={setOpen}
          fetchTheReceipt={fetchTheReceipt}
          handleDeliveryToggle={handleDeliveryToggle} 
        />
        {open && 
          <div className='inset-0 fixed flex items-center justify-center bg-black/50 z-50'>
            <OrderDetail theReceipt={theReceipt} setOpen={setOpen} />
          </div>
        }
      </div>


      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3  max-w-[1920px] px-2 sm:px-4 mx-auto">
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 text-sm">
            Page {page} of {pagination.totalPages || 1}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          Total Orders:{' '}
          <span className="font-semibold">{pagination.totalItems || orders.length}</span>
        </p>
      </div>
    </div>
  );
};

export default Orders;
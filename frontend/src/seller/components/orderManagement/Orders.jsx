import React, { useState, useEffect } from 'react';
import { getAllWhoOrderedAPI, getTheReceipt, updateDeliveryCheckAPI } from '../../../api/order.api';
import OrdersTable from './ordersTable/OrdersTable';
import OrderDetail from './orderDetail/OrderDetail';
import Pagination from '../user/Pagination';

const Orders = () => {
  
  const [orders, setOrders] = useState([]);
  const [theReceipt, setTheReceipt] = useState(null);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const limit = 12;
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
      const response = await updateDeliveryCheckAPI(orderId, isChecked);
      
      if (response.success) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, delivery_check: isChecked }
              : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update delivery status:', error.response?.data.message);
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

      {/* Use the Pagination component */}
      <Pagination 
        pagination={{
          page: page,
          totalPages: pagination.totalPages || 1,
          total: pagination.totalItems || orders.length
        }}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Orders;
import React from 'react'
import OrdersTableOnMb from './ordersTableOnMb'
import OrdersTableMd from './OrdersTableMd'

const OrdersTable = ({ 
  orders, 
  setOpen, 
  fetchTheReceipt,
  handleDeliveryToggle
}) => {
  // Helper function to check if order is less than 1 day old
  const isNewOrder = (paidAt) => {
    const paidDate = new Date(paidAt)
    const now = new Date()
    const diffInMs = now - paidDate
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return diffInHours < 24
  }

  const createdAt = (paid_at) => {
    return new Date(paid_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-[1920px] px-2 sm:px-4 mx-auto">
      {/* Desktop & Tablet View */}
      <OrdersTableMd 
        orders={orders}
        setOpen={setOpen}
        fetchTheReceipt={fetchTheReceipt}
        handleDeliveryToggle={handleDeliveryToggle}
        isNewOrder={isNewOrder}
        createdAt={createdAt}
      />

      {/* Mobile View */}
      <OrdersTableOnMb 
        orders={orders}
        setOpen={setOpen}
        fetchTheReceipt={fetchTheReceipt}
        handleDeliveryToggle={handleDeliveryToggle}
        isNewOrder={isNewOrder}
        createdAt={createdAt}
      />

    
    </div>
  )
}

export default OrdersTable
import React from 'react'

const CustomerInfo = ({whoami}) => {
  return (
    <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
        <output className="bg-gray-50 p-3 rounded-md border block">
            <span className="text-gray-800 font-medium">{whoami?.name}</span>
        </output>
    </section>
  )
}

export default CustomerInfo
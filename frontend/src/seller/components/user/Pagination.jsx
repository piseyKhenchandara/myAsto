import React from 'react'
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr';

const Pagination = ({pagination, handlePageChange}) => {
  return (
    <div>
        <div className="flex justify-center items-center gap-4 mt-8">
            <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
            <GrLinkPrevious />
            </button>

            <span className="text-gray-700 font-medium">
            Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
            <GrLinkNext/>
            </button>
        </div>

        {/* Total Count */}
        <div className="text-center mt-4 text-gray-600">
            Total Users: <span className="font-medium text-gray-800">{pagination.total}</span>
        </div>
    </div>
  )
}

export default Pagination

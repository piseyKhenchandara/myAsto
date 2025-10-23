import React, { useEffect, useState } from 'react';
import { viewAlluserAPI } from '../../../api/user.api';
import { useUser } from '../../../../context/UserContext';
import { useOutletContext } from 'react-router-dom';
import Pagination from './Pagination';
import UsersList from './UsersList';

const Users = () => {
  const { user: whoami, loading: loadingUserRole } = useUser();

  const {visible = false} = useOutletContext() ||{};
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ type: "", text: '' });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  useEffect(() => {
    const viewAllUser = async () => {
      try {
        setLoading(true);
        const res = await viewAlluserAPI(pagination.page, pagination.limit);
        setUsers(res.data.users || []);
        setPagination(prev => ({
          ...prev,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1
        }));
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to fetch users!"
        });
      } finally {
        setLoading(false);
      }
    };
    viewAllUser();
  }, [pagination.page]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  if (loadingUserRole) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-gray-300 text-center">Loading permission...</p>
      </div>
    );
  }

  if (whoami?.role !== 'admin') {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-gray-500">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] m-auto min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management</h2>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-xl border ${
            message.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          {message.text}
        </div>
      )}

        {loading ? (
            <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            ) : (
            <section>
                <UsersList visible={visible} users={users}/>

                <Pagination pagination={pagination} handlePageChange={handlePageChange}/>
            </section>
        )}
    </div>
  );
};

export default Users;

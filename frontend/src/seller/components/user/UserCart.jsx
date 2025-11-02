import React from 'react'
import { Link } from 'react-router-dom';

const UserCart = ({ user }) => {


  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    

    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <article>
      <Link to={`/dashboard/User-profile/${user.id}/receipts`}>
        <header className="flex items-center gap-4 mb-4">
          <img
            src={user.profile_picture || '/default-avatar.png'}
            alt={user.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-base sm:text-lg truncate">
              {user.name}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </header>

      
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 border-t-2 border-green-600">
          {/* <div className="flex items-center gap-2">
            <dt className="font-medium text-gray-700 text-xs sm:text-sm">Role:</dt>
            <dd className="text-gray-600 text-xs sm:text-sm capitalize">{user.role}</dd>
          </div> */}
          
          <div className="flex items-center gap-2">
            <dt className="font-medium text-gray-700 text-xs sm:text-sm">Phone:</dt>
            <dd className="text-gray-600 text-xs sm:text-sm">{user.phone || 'N/A'}</dd>
          </div>
          
          <div className="flex items-center gap-2">
            <dt className="font-medium text-gray-700 text-xs sm:text-sm">Created:</dt>
            <dd className="text-gray-600 text-xs sm:text-sm truncate">
              <time>{formatDateTime(user.created_at)}</time>
            </dd>
          </div>
          
          <div className="flex items-center gap-2">
            <dt className="font-medium text-gray-700 text-xs sm:text-sm">Last Login:</dt>
            <dd className="text-gray-600 text-xs sm:text-sm truncate">
              <time>{formatDateTime(user.last_login)}</time>
            </dd>
          </div>
        </dl>
      </Link>
      </article>
 
      
  )
}

export default UserCart
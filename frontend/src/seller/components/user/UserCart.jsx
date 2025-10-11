import React from 'react'

const UserCart = ({ user }) => {
  // Function to format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Format: MM/DD/YYYY, HH:MM AM/PM
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
    <div>
      {/* User Header - Always Horizontal */}
      <div className="flex items-center gap-4 mb-4">
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
      </div>

      {/* User Details - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 pt-3 border-t-2 border-green-600">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 text-xs sm:text-sm">Role:</span>
          <span className="text-gray-600 text-xs sm:text-sm capitalize">{user.role}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 text-xs sm:text-sm">Phone:</span>
          <span className="text-gray-600 text-xs sm:text-sm">{user.phone || 'N/A'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 text-xs sm:text-sm">Created:</span>
          <span className="text-gray-600 text-xs sm:text-sm truncate">
            {formatDateTime(user.created_at)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 text-xs sm:text-sm">Last Login:</span>
          <span className="text-gray-600 text-xs sm:text-sm truncate">
            {formatDateTime(user.last_login)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UserCart
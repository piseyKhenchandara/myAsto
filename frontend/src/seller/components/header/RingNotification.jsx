import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../../../context/notificationContext/NotificationContext';

const RingNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notification, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 md:p-2.5 hover:text-gray-800 focus:outline-none transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] xs:text-[10px] sm:text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown Panel */}
          <div className="fixed right-2 left-2 mt-2 sm:absolute sm:right-0 sm:left-auto sm:w-80 md:w-96 bg-white rounded-lg sm:rounded-xl shadow-2xl z-50 border border-gray-200 max-w-sm sm:max-w-none mx-auto sm:mx-0">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg sm:rounded-t-xl">
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({unreadCount} new)
                  </span>
                )}
              </p>
              <button
                onClick={markAllAsRead}
                className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors px-2 py-1 hover:bg-green-50 rounded"
              >
                Mark all read
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-[60vh] xs:max-h-[65vh] sm:max-h-96 overflow-y-auto">
              {notification.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <svg 
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                notification.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-3 sm:p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                      !notif.read
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed break-words">
                          {notif.message}
                        </p>
                        <p className="text-[10px] xs:text-xs text-gray-500 mt-1 sm:mt-1.5">
                          {new Date(notif.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RingNotification;
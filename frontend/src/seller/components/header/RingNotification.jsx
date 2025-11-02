import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../../../../context/notificationContext/NotificationContext';

const RingNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notification, 
    unreadCount, 
    markAllAsRead, 
    markAsRead,
    loadMoreNotifications,  // ✅ Add this
    hasMore,                 // ✅ Add this
    loading                  // ✅ Add this
  } = useNotifications();
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
        className="relative p-2 hover:text-gray-800 focus:outline-none transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
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
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] sm:text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 lg:hidden" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Dropdown Panel */}
          <aside className="fixed top-16 right-2 left-2 sm:top-auto sm:absolute sm:right-0 sm:left-auto sm:mt-2 w-auto sm:w-80 md:w-96 lg:w-[420px] bg-white rounded-lg shadow-2xl z-50 border border-gray-200 max-h-[calc(100vh-5rem)] sm:max-h-[600px] flex flex-col">
            {/* Header */}
            <header className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg flex-shrink-0">
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
                className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-medium transition-colors px-2 py-1 hover:bg-green-50 rounded whitespace-nowrap"
              >
                Mark all read
              </button>
            </header>

            {/* Notification List */}
            <section className="overflow-y-auto flex-1">
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
                <>
                  {notification.map((notif) => (
                    <article
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                        !notif.read
                          ? 'bg-green-50 hover:bg-green-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base  leading-relaxed break-words ${notif.message.includes('New') ? "text-black" : "text-green-600"}`}>
                            {notif.message}
                          </p>
                          <time className="text-xs text-gray-500 mt-1.5 block">
                            {new Date(notif.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </time>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                    </article>
                  ))}
                  
                  {/* ✅ Only show button if there are more notifications */}
                  {hasMore && (
                    <button 
                      onClick={loadMoreNotifications}
                      disabled={loading}
                      className='text-center w-full py-3 sm:py-4 bg-green-400 cursor-pointer hover:bg-green-500 active:bg-green-600 transition-colors hover:text-white text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                    > 
                      {loading ? 'Loading...' : 'See previous notifications'}
                    </button>
                  )}
                </>
              )}
            </section>
          </aside>
        </>
      )}
    </div>
  );
};

export default RingNotification;
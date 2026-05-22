import { useState, useRef, useEffect } from 'react';
import { useNotificationStore } from '../../../../store/notificationStore';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead: markAllRead } = useNotificationStore();
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative p-2 rounded-xl transition-all duration-200 group"
        style={{
          background: isOpen ? 'var(--gradient-accent)' : 'var(--glass-card)',
          border: '1px solid var(--border-glass)',
          color: 'var(--text-primary)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: isOpen ? 'rgba(123,44,191,0.9)' : 'var(--text-secondary)' }}
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-white text-[9px] font-bold rounded-full"
            style={{
              background: 'var(--status-error)',
              boxShadow: '0 0 0 2px var(--bg-base)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden animate-scale-in z-50"
          style={{
            background: 'var(--glass-modal)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-large)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                style={{
                  color: 'var(--status-info)',
                  background: 'rgba(37,99,235,0.1)',
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  All caught up!
                </p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => (
                <div
                  key={notification.id}
                  className="px-4 py-3 cursor-pointer transition-all duration-150 border-b last:border-b-0"
                  style={{
                    borderColor: 'var(--border-soft)',
                    background: notification.read ? 'transparent' : 'var(--gradient-accent)',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--glass-card)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'transparent' : 'var(--gradient-accent)'}
                >
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {notification.message}
                  </p>
                  {notification.time && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {notification.time}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

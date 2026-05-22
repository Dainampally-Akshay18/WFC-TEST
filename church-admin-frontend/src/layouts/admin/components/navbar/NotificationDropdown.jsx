import { useState } from 'react';
import { useNotificationStore } from '../../../../store/notificationStore';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount } = useNotificationStore();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden"
          style={{
            background: 'var(--glass-card)',
            border: '1px solid var(--border-glass)',
          }}
        >
          <div className="p-4">
            <h3 className="font-semibold mb-2">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-2 rounded hover:bg-white/5">
                    <p className="text-sm">{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

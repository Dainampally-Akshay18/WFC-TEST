import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { usePermissions } from '../../../../hooks/usePermissions';

const SidebarItem = ({ item, collapsed }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { hasPermission } = usePermissions();

  if (item.permission && !hasPermission(item.permission)) {
    return null;
  }

  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <span>{!collapsed && item.label}</span>
          {!collapsed && <span>{isExpanded ? '▼' : '▶'}</span>}
        </button>
        {isExpanded && !collapsed && (
          <div className="ml-4 mt-1">
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} collapsed={collapsed} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 mb-1 rounded-lg transition-colors ${
          isActive ? 'bg-white/20' : 'hover:bg-white/10'
        }`
      }
    >
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
};

export default SidebarItem;

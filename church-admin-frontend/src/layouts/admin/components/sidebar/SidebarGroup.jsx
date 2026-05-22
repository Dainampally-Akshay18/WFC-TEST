const SidebarGroup = ({ title, children, collapsed }) => {
  return (
    <div className="mb-4">
      {!collapsed && (
        <div className="px-4 py-2 text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
          {title}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default SidebarGroup;

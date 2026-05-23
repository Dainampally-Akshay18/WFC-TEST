const RoleBadge = ({ role }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--glass-badge)', border: '1px solid var(--border-glass)' }}>{role}</span>
);

export default RoleBadge;

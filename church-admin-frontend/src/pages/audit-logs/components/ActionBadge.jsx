const ActionBadge = ({ action }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ background: 'linear-gradient(90deg,#EEF2FF,#FCE7F3)', color: 'var(--text-primary)' }}>{action}</span>
);

export default ActionBadge;

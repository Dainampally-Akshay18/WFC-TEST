const ACTION_COLORS = {
  // Auth actions — cyan/teal
  SIGNUP:        { bg: 'rgba(6, 182, 212, 0.15)', text: '#22D3EE', border: 'rgba(6, 182, 212, 0.3)' },
  LOGIN:         { bg: 'rgba(6, 182, 212, 0.15)', text: '#22D3EE', border: 'rgba(6, 182, 212, 0.3)' },
  APPROVE_USER:  { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  REJECT_USER:   { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  CHANGE_ROLE:   { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' },

  // Create actions — green
  CREATE_BLOG:   { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  CREATE_EVENT:  { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  CREATE_PRAYER: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  CREATE_SERMON: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },
  CREATE_ADMIN:  { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: 'rgba(34, 197, 94, 0.3)' },

  // Update actions — amber/yellow
  UPDATE_BLOG:   { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
  UPDATE_EVENT:  { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
  UPDATE_PRAYER: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },
  UPDATE_SERMON: { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.3)' },

  // Delete actions — red
  DELETE_BLOG:   { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  DELETE_EVENT:  { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  DELETE_PRAYER: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  DELETE_SERMON: { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },

  // Publish actions — purple
  PUBLISH_BLOG:   { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' },
  PUBLISH_SERMON: { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: 'rgba(168, 85, 247, 0.3)' },

  // Misc
  PRAYED: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: 'rgba(59, 130, 246, 0.3)' },
};

const DEFAULT_COLOR = { bg: 'rgba(148, 163, 184, 0.15)', text: '#94A3B8', border: 'rgba(148, 163, 184, 0.3)' };

const getColorForAction = (action) => {
  if (ACTION_COLORS[action]) return ACTION_COLORS[action];

  // Fallback: match by prefix
  if (action?.startsWith('CREATE')) return ACTION_COLORS.CREATE_BLOG;
  if (action?.startsWith('UPDATE')) return ACTION_COLORS.UPDATE_BLOG;
  if (action?.startsWith('DELETE')) return ACTION_COLORS.DELETE_BLOG;
  if (action?.startsWith('PUBLISH')) return ACTION_COLORS.PUBLISH_BLOG;

  return DEFAULT_COLOR;
};

const formatAction = (action) => {
  if (!action) return '—';
  return action.replace(/_/g, ' ');
};

const ActionBadge = ({ action }) => {
  const color = getColorForAction(action);

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
      }}
    >
      {formatAction(action)}
    </span>
  );
};

export default ActionBadge;

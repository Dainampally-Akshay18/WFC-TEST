import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
          {item.path ? (
            <Link
              to={item.path}
              className="hover:underline"
              style={{ color: 'var(--text-secondary)' }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--text-primary)' }}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

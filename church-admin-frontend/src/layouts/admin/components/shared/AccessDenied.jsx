import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-6 py-2 rounded-lg"
          style={{
            background: 'var(--gradient-button)',
            color: 'white',
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;

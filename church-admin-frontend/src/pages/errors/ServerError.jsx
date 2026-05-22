import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-9xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          500
        </div>
        <h1 className="text-3xl font-bold mb-2">Server Error</h1>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Something went wrong on our end. Please try again later.
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

export default ServerError;

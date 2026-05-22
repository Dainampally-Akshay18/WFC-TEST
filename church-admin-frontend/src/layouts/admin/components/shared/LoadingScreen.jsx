const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

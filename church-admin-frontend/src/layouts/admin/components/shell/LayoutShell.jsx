const LayoutShell = ({ children }) => {
  return (
    <div
      className="flex min-h-screen min-w-0 flex-1 flex-col transition-all duration-300"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {children}
    </div>
  );
};

export default LayoutShell;

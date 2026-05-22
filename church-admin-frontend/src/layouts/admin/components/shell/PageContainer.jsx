const PageContainer = ({ children, maxWidth = 'max-w-7xl' }) => {
  return (
    <div className={`mx-auto ${maxWidth}`}>
      {children}
    </div>
  );
};

export default PageContainer;

const MainContent = ({ children }) => {
  return (
    <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8 animate-fade-in-up">
      {children}
    </main>
  );
};

export default MainContent;

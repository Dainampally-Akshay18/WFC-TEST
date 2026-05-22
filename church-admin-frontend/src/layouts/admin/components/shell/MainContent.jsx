const MainContent = ({ children }) => {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
      {children}
    </main>
  );
};

export default MainContent;

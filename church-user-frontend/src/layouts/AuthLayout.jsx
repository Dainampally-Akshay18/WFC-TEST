import Navbar from "./Navbar";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-lg p-8 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

const Logo = ({ collapsed = false }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500" />
      {!collapsed && <span className="text-xl font-bold">Church Admin</span>}
    </div>
  );
};

export default Logo;

import { useState } from 'react';

const SidebarCollapse = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <span>{title}</span>
        <span className="text-xs">{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && <div className="ml-4 mt-1">{children}</div>}
    </div>
  );
};

export default SidebarCollapse;

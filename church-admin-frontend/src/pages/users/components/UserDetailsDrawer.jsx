import React from 'react';
import { X, Mail, Calendar, MapPin, Shield } from 'lucide-react';
import StatusBadge from './StatusBadge';
import RoleBadge from './RoleBadge';
import { useUserStore } from '../../../store/userStore';

const UserDetailsDrawer = () => {
  const { selectedUser, drawerOpen, setDrawerOpen, setSelectedUser } = useUserStore();

  const handleClose = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  if (!selectedUser && !drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[var(--bg-elevated)] glass-sidebar z-50 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-[var(--border-glass)] flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">User Details</h2>
          <button onClick={handleClose} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {selectedUser && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">{selectedUser.name}</h3>
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <Mail className="w-5 h-5 text-purple-500" />
                  <span>{selectedUser.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <RoleBadge role={selectedUser.role} />
                </div>

                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span>{selectedUser.branch || 'No branch assigned'}</span>
                </div>

                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <div className="flex flex-col">
                    <span className="text-sm">Created: {new Date(selectedUser.createdAt).toLocaleString()}</span>
                    {selectedUser.approvedAt && (
                      <span className="text-sm">Approved: {new Date(selectedUser.approvedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-[var(--border-glass)]">
          <button onClick={handleClose} className="w-full py-2 px-4 bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-[var(--text-primary)] rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDetailsDrawer;

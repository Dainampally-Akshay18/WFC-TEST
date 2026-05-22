import React from 'react';
import { Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import RoleBadge from './RoleBadge';

const UserTable = ({ users, onApprove, onReject, onDelete, onView }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in-up shadow-[var(--shadow-medium)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-glass)]">
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Name</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Role</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Branch</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">Joined</th>
              <th className="p-4 text-sm font-semibold text-[var(--text-secondary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-[var(--text-muted)]">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-[var(--border-glass)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--text-primary)]">{user.name}</span>
                      <span className="text-xs text-[var(--text-muted)]">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4"><RoleBadge role={user.role} /></td>
                  <td className="p-4"><StatusBadge status={user.status} /></td>
                  <td className="p-4 text-sm text-[var(--text-primary)]">{user.branch || 'N/A'}</td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onView(user)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.status === 'PENDING' && (
                        <>
                          <button onClick={() => onApprove(user._id)} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => onReject(user._id)} className="p-1.5 text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => onDelete(user._id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete user">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

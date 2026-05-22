import React, { useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { userService } from '../../api/services/user.service';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';
import UserDetailsDrawer from './components/UserDetailsDrawer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UserList = () => {
  const { 
    users, 
    isLoading, 
    error, 
    pagination, 
    filters,
    fetchUsers, 
    setPage, 
    setSelectedUser, 
    setDrawerOpen 
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page, fetchUsers]);

  const handleApprove = async (id) => {
    try {
      await userService.approveUser(id);
      fetchUsers();
    } catch (err) {
      console.error('Failed to approve user', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await userService.rejectUser(id);
      fetchUsers();
    } catch (err) {
      console.error('Failed to reject user', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        alert(err?.response?.data?.error?.message || 'Failed to delete user');
      }
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] animate-slide-in-left">User Management</h1>
          <p className="text-[var(--text-secondary)] animate-slide-in-left" style={{ animationDelay: '100ms' }}>
            Manage roles, branches, and approvals.
          </p>
        </div>
      </div>

      <UserFilters />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg animate-fade-in">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="glass-card h-96 rounded-2xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <UserTable 
            users={users} 
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            onView={handleView}
          />
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between glass-card p-4 rounded-xl mt-6 animate-fade-in-up">
              <span className="text-sm text-[var(--text-secondary)]">
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, pagination.page - 1))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg bg-black/5 dark:bg-white/5 disabled:opacity-50 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[var(--text-primary)]" />
                </button>
                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, pagination.page + 1))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg bg-black/5 dark:bg-white/5 disabled:opacity-50 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[var(--text-primary)]" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <UserDetailsDrawer />
    </div>
  );
};

export default UserList;

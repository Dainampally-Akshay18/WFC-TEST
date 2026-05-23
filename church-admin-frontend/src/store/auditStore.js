import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auditService } from '../api/services/audit.service';

export const useAuditStore = create(
  persist(
    (set, get) => ({
      logs: [],
      statistics: null,
      loading: false,
      error: null,
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      filters: {
        action: '',
        performerRole: '',
        targetType: '',
        branch: '',
        startDate: '',
        endDate: '',
        search: '',
      },
      selectedLog: null,
      drawerOpen: false,

      setFilters: (partial) => set((state) => ({ filters: { ...state.filters, ...partial } })),
      setPagination: (partial) => set((state) => ({ pagination: { ...state.pagination, ...partial } })),

      fetchLogs: async () => {
        set({ loading: true, error: null });
        try {
          const { pagination, filters } = get();
          const params = {
            page: pagination.page,
            limit: pagination.limit,
            action: filters.action || undefined,
            performerRole: filters.performerRole || undefined,
            targetType: filters.targetType || undefined,
            branch: filters.branch || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
          };

          const res = await auditService.getAuditLogs(params);
          if (res?.data?.success) {
            const data = res.data.data;
            set({
              logs: data.logs || [],
              pagination: {
                ...pagination,
                page: data.pagination.page || pagination.page,
                limit: data.pagination.limit || pagination.limit,
                total: data.pagination.total || 0,
                pages: data.pagination.pages || 0,
              },
            });
          } else {
            set({ error: 'Failed to load logs' });
          }
        } catch (err) {
          set({ error: err.message || 'Network error' });
        } finally {
          set({ loading: false });
        }
      },

      fetchStatistics: async () => {
        set({ loading: true, error: null });
        try {
          const res = await auditService.getAuditStatistics?.() || await auditService.getStatistics?.();
          // support both naming conventions if service exposes one
          const payload = res?.data?.data || res?.data || null;
          set({ statistics: payload });
        } catch (err) {
          set({ error: err.message || 'Failed to load statistics' });
        } finally {
          set({ loading: false });
        }
      },

      fetchLogById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await auditService.getAuditLog(id);
          if (res?.data?.success) {
            set({ selectedLog: res.data.data.log });
          } else {
            set({ error: 'Failed to load log' });
          }
        } catch (err) {
          set({ error: err.message || 'Network error' });
        } finally {
          set({ loading: false });
        }
      },

      openDrawer: (id) => {
        set({ drawerOpen: true });
        if (id) get().fetchLogById(id);
      },
      closeDrawer: () => set({ drawerOpen: false, selectedLog: null }),
    }),
    { name: 'audit-storage' }
  )
);

export default useAuditStore;









import { create } from 'zustand';
import { auditService } from '../api/services/audit.service';

// ── helper: apply filters to the full logs array ──
const applyFilters = (allLogs, filters) => {
  let result = [...allLogs];

  if (filters.action) {
    result = result.filter((l) => l.action === filters.action);
  }
  if (filters.performerRole) {
    result = result.filter((l) => l.performerRole === filters.performerRole);
  }
  if (filters.targetType) {
    result = result.filter((l) => l.targetType === filters.targetType);
  }
  if (filters.branch) {
    result = result.filter(
      (l) =>
        (l.metadata?.branch || '').toLowerCase().includes(filters.branch.toLowerCase())
    );
  }
  if (filters.startDate) {
    const start = new Date(filters.startDate).getTime();
    result = result.filter((l) => new Date(l.createdAt).getTime() >= start);
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate).getTime();
    result = result.filter((l) => new Date(l.createdAt).getTime() <= end);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        (l.action || '').toLowerCase().includes(q) ||
        (l.performedBy?.name || '').toLowerCase().includes(q) ||
        (l.performerRole || '').toLowerCase().includes(q) ||
        (l.targetType || '').toLowerCase().includes(q) ||
        (l.metadata?.branch || '').toLowerCase().includes(q)
    );
  }

  return result;
};

// ── helper: paginate ──
const paginate = (filteredLogs, currentPage, itemsPerPage) => {
  const total = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * itemsPerPage;
  const displayedLogs = filteredLogs.slice(startIdx, startIdx + itemsPerPage);

  return { displayedLogs, total, totalPages, safePage };
};

export const useAuditStore = create((set, get) => ({
  // ── raw data from API ──
  allLogs: [],

  // ── derived data (recomputed by _recompute) ──
  filteredLogs: [],
  displayedLogs: [],

  // ── pagination state ──
  currentPage: 1,
  itemsPerPage: 20,
  totalFiltered: 0,
  totalPages: 1,

  // ── filter state ──
  filters: {
    action: '',
    performerRole: '',
    targetType: '',
    branch: '',
    startDate: '',
    endDate: '',
    search: '',
  },

  // ── UI state ──
  loading: false,
  statsLoading: false,
  error: null,
  statistics: null,
  selectedLog: null,
  drawerOpen: false,

  // ═══════════════════════════════════════════
  // Internal: recompute filtered + paginated
  // ═══════════════════════════════════════════
  _recompute: () => {
    const { allLogs, filters, currentPage, itemsPerPage } = get();
    const filtered = applyFilters(allLogs, filters);
    const { displayedLogs, total, totalPages, safePage } = paginate(filtered, currentPage, itemsPerPage);

    set({
      filteredLogs: filtered,
      displayedLogs,
      totalFiltered: total,
      totalPages,
      currentPage: safePage,
    });
  },

  // ═══════════════════════════════════════════
  // Actions
  // ═══════════════════════════════════════════
  fetchAllLogs: async () => {
    set({ loading: true, error: null });
    try {
      const logs = await auditService.getAllLogs();
      console.log('[AuditStore] Received logs:', logs, 'isArray:', Array.isArray(logs), 'length:', logs?.length);
      const logsArray = Array.isArray(logs) ? logs : [];
      set({ allLogs: logsArray, currentPage: 1 });
      get()._recompute();
      const state = get();
      console.log('[AuditStore] After recompute - allLogs:', state.allLogs.length, 'filtered:', state.filteredLogs.length, 'displayed:', state.displayedLogs.length);
    } catch (err) {
      console.error('[AuditStore] fetchAllLogs error:', err);
      set({ allLogs: [], error: err.message || 'Failed to fetch audit logs' });
      get()._recompute();
    } finally {
      set({ loading: false });
    }
  },

  fetchStatistics: async () => {
    set({ statsLoading: true });
    try {
      const stats = await auditService.getStatistics();
      set({ statistics: stats });
    } catch (err) {
      console.error('[AuditStore] fetchStatistics error:', err);
    } finally {
      set({ statsLoading: false });
    }
  },

  setFilters: (partial) => {
    set((state) => ({
      filters: { ...state.filters, ...partial },
      currentPage: 1, // reset to page 1 on any filter change
    }));
    get()._recompute();
  },

  clearFilters: () => {
    set({
      filters: {
        action: '',
        performerRole: '',
        targetType: '',
        branch: '',
        startDate: '',
        endDate: '',
        search: '',
      },
      currentPage: 1,
    });
    get()._recompute();
  },

  setPage: (page) => {
    set({ currentPage: page });
    get()._recompute();
  },

  setItemsPerPage: (n) => {
    set({ itemsPerPage: n, currentPage: 1 });
    get()._recompute();
  },

  // ── Drawer ──
  openDrawer: (logOrId) => {
    const { allLogs } = get();
    // Try to find log from allLogs first (avoid extra API call)
    const found = typeof logOrId === 'string'
      ? allLogs.find((l) => l._id === logOrId)
      : logOrId;

    if (found) {
      set({ drawerOpen: true, selectedLog: found });
    } else if (typeof logOrId === 'string') {
      // fallback: fetch from API
      set({ drawerOpen: true });
      get()._fetchLogById(logOrId);
    }
  },

  _fetchLogById: async (id) => {
    try {
      const log = await auditService.getAuditLog(id);
      if (log) {
        set({ selectedLog: log });
      }
    } catch (err) {
      console.error('[AuditStore] fetchLogById error:', err);
    }
  },

  closeDrawer: () => set({ drawerOpen: false, selectedLog: null }),
}));

export default useAuditStore;

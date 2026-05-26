import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuditStore } from '../../store/auditStore';
import AuditToolbar from './components/AuditToolbar';
import AuditStatsCards from './components/AuditStatsCards';
import AuditFilters from './components/AuditFilters';
import AuditTable from './components/AuditTable';
import AuditPagination from './components/AuditPagination';
import AuditDetailsDrawer from './components/AuditDetailsDrawer';
import AuditSkeleton from './components/AuditSkeleton';

const AuditLogs = () => {
    const { fetchAllLogs, fetchStatistics, loading, drawerOpen } = useAuditStore();

    // Fetch ALL logs once on mount — filtering & pagination happen in frontend
    useEffect(() => {
        fetchAllLogs();
        fetchStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Open drawer if URL contains id
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            useAuditStore.getState().openDrawer(id);
        }
    }, [id]);

    return (
        <div className="space-y-6 p-4 md:p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Audit Logs</h1>
                <AuditToolbar />
            </div>

            <AuditStatsCards />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-1">
                    <AuditFilters />
                </div>

                <div className="lg:col-span-3">
                    {loading ? (
                        <AuditSkeleton />
                    ) : (
                        <>
                            <AuditTable />
                            <AuditPagination />
                        </>
                    )}
                </div>
            </div>

            {drawerOpen && <AuditDetailsDrawer />}
        </div>
    );
};

export default AuditLogs;

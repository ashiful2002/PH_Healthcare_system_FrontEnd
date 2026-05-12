import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getDashboardData } from "@/services/dashboard.service"
import AdminDashboardContent from "@/components/modules/Dashboard/AdminDashboardContent"

const AdminManagementPage = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery({
        queryKey: ["admin-dashboard-data"],
        queryFn: getDashboardData,

        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
    })
    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <AdminDashboardContent />
            </HydrationBoundary>
        </div>
    )
}

export default AdminManagementPage
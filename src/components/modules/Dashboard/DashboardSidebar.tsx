import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItemsByRole } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.services"
import { NavSection } from "@/types/dashboard.types"
import DashboardSidebarContent from "./DashboardSidebarContent"


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()
  const navItems: NavSection[] | undefined = getNavItemsByRole(userInfo?.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role)

  return (
   <DashboardSidebarContent dashboardHome={dashboardHome} navItems={navItems || []} userInfo={userInfo} />
  )
}

export default DashboardSidebar 
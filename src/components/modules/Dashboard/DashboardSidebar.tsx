import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItemsByRole } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.services"
import { NavSection } from "@/types/dashboard.types"


const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()
  const navItems: NavSection[] | undefined = getNavItemsByRole(userInfo?.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role)

  return (
    <div>DashboardSidebar</div>
  )
}

export default DashboardSidebar
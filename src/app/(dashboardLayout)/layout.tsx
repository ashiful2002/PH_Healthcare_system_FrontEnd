import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar"
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar"
import { ReactNode } from "react"

const RootDashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* dashboard sidebar */}
            < DashboardSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* dashboard Navbar */}
                < DashboardNavbar />

                {/* dashboard main content */}
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                    <div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default RootDashboardLayout 
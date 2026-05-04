
export type UserRole = "ADMIN" | "DOCTOR" | "PATIENT" | "SUPER_ADMIN" | "COMMON" | null;

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]

export const isAuthRoute = (pathName: string) => {
    return authRoutes.some((route) => pathName === route)
}

export type RouteConfig = {
    exact: string[],
    pattern: RegExp[],
}


export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password"],
    pattern: []
}

export const patientProtectedRoutes: RouteConfig = {
    pattern: [/^\/dashboard/],
    exact: ["/payment/success"]
}

export const doctorProtectedRoutes: RouteConfig = {
    pattern: [/^\/doctor\/dashboard/],
    exact: []
}

export const adminProtectedRoutes: RouteConfig = {
    pattern: [/^\/admin\/dashboard/],
    exact: []
}

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {

    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname))
}


export const getRouteOwner = (pathname: string) => {

    if (isRouteMatches(pathname, doctorProtectedRoutes)) {
        return "DOCTOR"
    }
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN"
    }
    if (isRouteMatches(pathname, patientProtectedRoutes)) {
        return "PATIENT"
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON"
    }
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole) => {
    switch (role) {
        case "DOCTOR":
            return "/doctor/dashboard"
        case "ADMIN":
            return "/admin/dashboard"
        case "PATIENT":
            return "/dashboard"
        case "COMMON":
            return "/my-profile"
        default:
            return "/"
    }

}


export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
    const unifiedSuperAdminRole = role === "SUPER_ADMIN" ? "ADMIN" : role;
    role = unifiedSuperAdminRole;

    const routerOwner = getRouteOwner(redirectPath);

    if (routerOwner === null || routerOwner === "COMMON") {
        return true
    }

    if (routerOwner === role) {
        return true
    }
    return false
}
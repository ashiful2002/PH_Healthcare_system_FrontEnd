import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/jwtUtils";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { getNewTokensWithRefreshToken, getUserInfo } from "./services/auth.services";
import { isTokenExpiringSoon } from "./lib/tokenUtils";



const refreshTokenMiddleware = async (refreshToken: string): Promise<boolean> => {
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken)
        return refresh;
    } catch (error) {
        return false;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const decodedAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).data;

    const isValidAccessToken = accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

    let userRole: UserRole | null = null;

    if (decodedAccessToken) {
        userRole = decodedAccessToken.role as UserRole;
    }

    const routerOwner = getRouteOwner(pathname);

    const unifiedSuperAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;
    userRole = unifiedSuperAdminRole;


    const isAuth = isAuthRoute(pathname);



    // proactive refreshtoken if refresh token exists ans access token is expiring soon

    if (isValidAccessToken && refreshToken && (await isTokenExpiringSoon(accessToken))) {
        const requestHeaders = new Headers(request.headers);


        const response = NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })


        try {
            const refreshed = await refreshTokenMiddleware(refreshToken);
            if (refreshed) {
                requestHeaders.set("x-token-refreshed", "1")
            }

            return NextResponse.next({
                request: {
                    headers: requestHeaders
                },
                headers: response.headers
            })
        } catch (error) {
            console.log("error in refreshing token", error);

        }
        return response
    }
    //  case -1 : user is logged in and trying to access auth routes
    if (isAuth && isValidAccessToken) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    if (pathname === "/reset-password") {
        const email = request.nextUrl.searchParams.get("email");
        const token = request.nextUrl.searchParams.get("token");


        // case 1: user has needPasswordChange = true and trying to access reset-password route
        if (accessToken && email) {
            const userInfo = await getUserInfo();

            if (userInfo.needPasswordChange) {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
            }
        }

        // case 2: user comming from forgot password 
        if (email) {
            return NextResponse.next()
        }

        // case 3: user trying to access reset-password route without email and token
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)


    }

    // case 2: user trying to access public route  > allow 
    if (routerOwner === null) {
        return NextResponse.next();
    }

    //  case 3: user trying to access protected route but not logged in > redirect to login route
    if (!accessToken || !isValidAccessToken) {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // case: 4 enforce user to change password

    if (accessToken) {
        const userInfo = await getUserInfo();

        if (userInfo?.emailVerified === false) {
            if (pathname !== "/verify-email") {
                const veeifyEmailUrl = new URL("/verify-email", request.url)
                veeifyEmailUrl.searchParams.set("email", userInfo.email)
                return NextResponse.redirect(veeifyEmailUrl)
            }
            return NextResponse.next();
        }

        if (userInfo && userInfo.emailVerified && pathname === "/verify-email") {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }

        if (userInfo.needPasswordChange) {
            if (pathname !== "/reset-password") {
                const resetPasswordUrl = new URL("/reset-password", request.url)
                resetPasswordUrl.searchParams.set("email", userInfo.email)
                return NextResponse.redirect(resetPasswordUrl);
            }
            return NextResponse.next();
        }


        if (userInfo && !userInfo.needPasswordChange && pathname === "/reset-password") {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
    }


    // user trying to access common protected route > allow
    if (routerOwner === "COMMON") {
        return NextResponse.next();
    }

    // case 5: user trying to access role specific route but not have required role > redirect to there default dashboard

    if (routerOwner === "ADMIN" || routerOwner === "DOCTOR" || routerOwner === "PATIENT") {

        if (routerOwner !== userRole) {

            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)']
}
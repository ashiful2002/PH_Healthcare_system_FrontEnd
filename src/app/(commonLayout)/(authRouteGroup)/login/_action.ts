"use server";

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const loginAction = async (payload: ILoginPayload, redirectPath?: string) => {
    const parsedPayload = loginZodSchema.safeParse(payload);

    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        };
    }

    try {
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);

        const { accessToken, refreshToken, token, user } = response.data;
        const { role, emailVerified, needPasswordChange, email } = user;

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

        if (!emailVerified) {
            redirect("/verify-email");
        } else if (needPasswordChange) {
            redirect(`/reset-password?email=${email}`);
        } else {
            const targetPath =
                redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
                    ? redirectPath
                    : getDefaultDashboardRoute(role as UserRole);

            redirect(targetPath);
        }
    } catch (error: unknown) {
        // ✅ Always rethrow Next.js redirects
        if (isRedirectError(error)) throw error;

        // ✅ Handle unverified email error from backend
        if ((error as any)?.response?.data?.message === "Email not verified") {
            redirect(`/verify-email?email=${payload.email}`);
        }

        const message =
            (error as any)?.response?.data?.message ||
            (error as any)?.message ||
            "Something went wrong";

        return {
            success: false,
            message: `Login failed: ${message}`,
        };
    }
};
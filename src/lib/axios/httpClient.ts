import { ApiResponse } from "@/types/api.types";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";
import { cookies, headers } from "next/headers";
import { getNewTokensWithRefreshToken } from "@/services/auth.services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}


const tryRefreshToken = async (
    accessToken: string,
    refreshToken: string
): Promise<void> => {


    if (!isTokenExpiringSoon(accessToken)) {
        return
    }
    const requestHeader = await headers()

    if (requestHeader.get("x-token-refreshed") === "1") {
        return
    }

    try {
        await getNewTokensWithRefreshToken(refreshToken)
    } catch (error) {
        console.log("error in refreshing token", error);

    }


}

const axiosInstance = async () => {

    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;


    if (accessToken && refreshToken) {
        await tryRefreshToken(accessToken, refreshToken)
    }


    const coookieHeader = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ")


    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
            "Cookie": coookieHeader
        },
    })
    return instance;
}

export interface ApiRequestOptions {
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance()
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers
        });
        return response.data
    } catch (error) {
        console.log(`Get request to ${endpoint} failed: ${error}`);
        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance()
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        });
        return response.data;
    } catch (error) {
        console.log(`Post request to ${endpoint} failed: ${error}`);
        throw error;
    }
}

const httpPut = async<TData>(endpoint: string, data: any, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance()
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers
        });
        return response.data;
    } catch (error) {
        console.log(`Put request to ${endpoint} failed: ${error}`);
        throw error;
    }
}

const httpDelete = async<TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance()
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers
        });
        return response.data;
    } catch (error) {
        console.log(`Delete request to ${endpoint} failed: ${error}`);
        throw error;
    }
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    delete: httpDelete
}
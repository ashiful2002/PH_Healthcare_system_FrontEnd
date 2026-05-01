import { ApiResponse } from "@/types/api.types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const axiosInstance = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": "application/json",
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
        const instance = axiosInstance()
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
        const response = await axiosInstance().post<ApiResponse<TData>>(endpoint, data, {
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
        const response = await axiosInstance().put<ApiResponse<TData>>(endpoint, data, {
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
        const response = await axiosInstance().delete<ApiResponse<TData>>(endpoint, {
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
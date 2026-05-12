"use server"
import { httpClient } from "@/lib/axios/httpClient";
import { Doctor } from "@/types/doctor.types";




export const getDoctors = async () => {
    try {
        const doctors = await httpClient.get<Doctor[]>("/doctors");
        return doctors;
    } catch (error) {
        throw error;
    }
}

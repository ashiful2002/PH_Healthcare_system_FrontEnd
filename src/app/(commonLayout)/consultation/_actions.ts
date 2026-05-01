"use server"
import { httpClient } from "@/lib/axios/httpClient";


interface Doctor {
    id: string;
    name: string;
    specialization: string;
    experience: number;
    imageUrl: string;
    consultationFee: number;
    rating: number;
    isAvailable: boolean;
}

export const getDoctors = async () => {
    try {
        const doctors = await httpClient.get<Doctor[]>("/doctors");
        return doctors;
    } catch (error) {
        throw error;
    }
}


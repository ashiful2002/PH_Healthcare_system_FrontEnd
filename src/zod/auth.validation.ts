import { z } from "zod";

export const loginZodSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters long").max(10, "Password must be at most 10 characters long"),
})


export type ILoginPayload = z.infer<typeof loginZodSchema>
export interface ILoginResponse {
    token: string;
    refreshToken: string;
    accessToken: string;
    url?: string | undefined;
    user: {
        needPasswordChange: boolean;
        email: string;
        name: string;
        role: string;
        image?: string;
        status: string;
        isDeleted: boolean;
        emailVerified: boolean;

    };
}
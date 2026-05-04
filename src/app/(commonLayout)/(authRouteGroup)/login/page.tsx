import LoginForm from "@/components/modules/Auth/LoginForm"


interface LoginParams {
    searchParams: Promise<{ redirect?: string }>;
}


const LoginPage = async ({ searchParams }: LoginParams) => {
    const params = await searchParams;

    const redirectPath = params.redirect


    return (
        <div className="h-screen flex items-center justify-center">< LoginForm redirectPath={redirectPath} /></div>
    )
}

export default LoginPage
'use client'

import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FetchApi} from "@/app/core/api.handler";
import {cn} from "@/lib/utils";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

// Define your schema using Zod
const loginAdminSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

const Login = () => {
    const router = useRouter()
    const {register, handleSubmit, formState: { errors }}
        = useForm({resolver: zodResolver(loginAdminSchema)});

    const loginAdmin = async (data: any) => {
        try {
            const response = await FetchApi('/api/admin/login', 'POST', {
                email: data.email,
                password: data.password,
            })
            console.log('Admin logged')
            router.push('/admin/protect/dashboard')
        } catch (e) {
            console.log(e, "Admin login error")
        }
    }

    return <>
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:pb-10 md:px-10 pt-[120px]">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(loginAdmin)}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                            {...register('email')}
                                        />
                                        {/*{errors.email && <p className="text-red-500">{errors?.email?.message}</p>}*/}
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            {/*<a*/}
                                            {/*  href="#"*/}
                                            {/*  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"*/}
                                            {/*>*/}
                                            {/*  Forgot your password?*/}
                                            {/*</a>*/}
                                        </div>
                                        <Input id="password" type="password" required {...register('password')}/>
                                        {/*{errors.password && <p className="text-red-500">{errors?.password?.message}</p>}*/}
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Login
                                    </Button>
                                    {/*<Button variant="outline" className="w-full">*/}
                                    {/*  Login with Google*/}
                                    {/*</Button>*/}
                                </div>
                                {/*<div className="mt-4 text-center text-sm">*/}
                                {/*  Don&apos;t have an account?{" "}*/}
                                {/*  <a href="#" className="underline underline-offset-4">*/}
                                {/*    Sign up*/}
                                {/*  </a>*/}
                                {/*</div>*/}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </>
}

export default Login

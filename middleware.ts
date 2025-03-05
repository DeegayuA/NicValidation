import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {cookies} from "next/headers";
import {LOGGED_TOKEN, LOGGED_USER, USER} from "@/lib/constants";
import {decrypt} from "@/lib/encryption";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/admin/protect')) {
        const hasToken = (await cookies()).has(LOGGED_TOKEN)
        const loggedUser = (await cookies()).get(LOGGED_USER)
        if (!hasToken || (decrypt(loggedUser?.value) !== USER.ADMIN)) {
            return NextResponse.redirect(new URL('/admin/login', request.nextUrl))
        }
    }
    if (request.nextUrl.pathname.startsWith('/volunteer/protect')) {
        const hasToken = (await cookies()).has(LOGGED_TOKEN)
        const loggedUser = (await cookies()).get(LOGGED_USER)
        if (!hasToken || (decrypt(loggedUser?.value) !== USER.VOLUNTEER)) {
            return NextResponse.redirect(new URL('/volunteer/login', request.nextUrl))
        }
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/admin/protect/:path*', "/volunteer/protect/:path*"],
}

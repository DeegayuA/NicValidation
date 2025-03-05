import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {LOGGED_TOKEN, LOGGED_USER, USER} from "@/lib/constants";
import {decrypt} from "@/lib/encryption";
import jwt from "jsonwebtoken";
import {findAuthAdminService} from "@/app/api/admin/admin.service";


export async function AuthCheck(user: string) {
    try {
        const tokenCookie = await cookies()
        const getToken = decrypt(tokenCookie.get(LOGGED_TOKEN)?.value || null)
        const getUser = decrypt(tokenCookie.get(LOGGED_USER)?.value || null)
        let data: any;
        if (getToken && user === getUser) {
            const token: any = jwt.verify(getToken, JWT_PRIVATE_KEY)
            const userId = token?.id
            if (userId && (user === token?.user)) {
                switch (user) {
                    case USER.ADMIN:
                        data = await findAuthAdminService(userId);
                        break
                    // case USER.VOLUNTEER:
                    //     const data = await findAuthVolunteerService(userId)
                    //     break
                }
                if (data.id) {
                    return {userAuth: true}
                }
            }

        }
        (await cookies()).delete(LOGGED_TOKEN);
        (await cookies()).delete(LOGGED_USER);
        return NextResponse.json({userAuth: false}, {status: 401})
    } catch (e: any) {
        if (e?.message === JWT_EXPIRE_MSG){
            (await cookies()).delete(LOGGED_TOKEN);
            (await cookies()).delete(LOGGED_USER);
            return NextResponse.json({userAuth: false}, {status: 401})
        }
        throw e
    }
}

export const JWT_PRIVATE_KEY = "4chh/MryG+j9fnEwV8LSFFx9kQQRDJZNDZRXR/jTuY/w4S0mSNq6pv+uBMrWMx2KXJ2DgsYRj2rGQ7hmPFIIJqoyxTKgnB/br1wzCa+siIunel8h74izfc5WQAnVa2HbRuFhs/qSToweQzdDoWbfjMpnvrDD3eyxit+AW5Ep/5hvSyEmXtBsADrBaqU0GELbtoM/iMmCj5KrIZgBNFseH99WtHkc9UvuBdvNEhofljm7c07LfSO+kovZYfXqCSdLW15eI3Sc1V8Nr/mqccECnXabORAmAikfh"
export const JWT_EXPIRE_TIME = '1m'
export const JWT_EXPIRE_MSG = 'jwt expired'

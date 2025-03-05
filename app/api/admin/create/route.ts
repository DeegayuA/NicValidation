import {NextResponse} from "next/server";
import {AuthCheck} from "@/app/api/authenticate";
import {createAdminService} from "@/app/api/admin/admin.service";
import {USER} from "@/lib/constants";


export async function POST(request: any) {
    const body = await request.json()

    if (!body.email || !body.password || !body.name) {
        return NextResponse.json(
            { error: 'Name, Email & Password are required!' },
            { status: 200 },
        )
    }
    try {
        const result: any = await AuthCheck(USER.ADMIN)
        if (result.userAuth) {
            const data = await createAdminService(body)

            return NextResponse.json(data, {status: 200})
        }
        return NextResponse.json({userAuth: false}, {status: 401})
    } catch (e) {
        throw e
    }
}

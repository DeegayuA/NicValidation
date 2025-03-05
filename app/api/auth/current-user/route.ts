// import {PrismaClient} from "@prisma/client";
// import {cookies} from "next/headers";
// import jwt from "jsonwebtoken";
// import {NextResponse} from "next/server";
//
// const prisma = new PrismaClient()
//
import {NextResponse} from "next/server";

export async function GET() {
//     try {
//         const tokenCookie = await cookies()
//         const getToken = tokenCookie.get('token')
//
//         if (getToken) {
//             const token = jwt.verify(getToken.value, 'appSecret')
//
//             const userId = token.id
//             if (!userId) {
//                 return NextResponse.json(
//                     {error: 'Unauthorized request!'},
//                     {status: 200},
//                 )
//             }
//
//             const user = await prisma.user.findUnique({
//                 where: {
//                     id: userId
//                 }
//             })
//             if (!user) {
//                 return NextResponse.json(
//                     {error: 'An error occurred!'},
//                     {status: 200},
//                 )
//             }
//
//             return NextResponse.json(user, {status: 200},)
//         } else {
//             return NextResponse.json(null, {status: 200},)
//         }
//     } catch (e) {
        return NextResponse.json(
            {error: 'An error occurred. Please try again later'},
            {status: 200},
        )
//     } finally {
//         await prisma.$disconnect()
//     }
}

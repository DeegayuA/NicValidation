// import {NextResponse} from "next/server";
// import {PrismaClient} from "@prisma/client";
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import {cookies} from "next/headers";
//
// const prisma = new PrismaClient()
//
import {NextResponse} from "next/server";

export async function POST(request: any) {
//     const body = await request.json()
//     const {email, password} = body
//
//     if (!email || !password) {
//         return NextResponse.json(
//             {error: 'Email and password are required!'},
//             {status: 200},
//         )
//     }
//
//     try {
//         const user = await prisma.user.findFirst({
//             where: {
//                 email: email.toLowerCase()
//             }
//         })
//         if (!user) {
//             return NextResponse.json(
//                 {error: 'Invalid user Credentials!'},
//                 {status: 200},
//             )
//         }
//         const validPassword = await bcrypt.compare(password, user.password)
//
//         if (!validPassword) {
//             return NextResponse.json(
//                 {error: 'Invalid Credentials!'},
//                 {status: 200},
//             )
//         }
//
//         const token = jwt.sign({id: user.id}, 'appSecret');
//         (await cookies()).set('token', token)
//
//         return NextResponse.json(user, {status: 200},)
//
//     } catch (e) {

    return NextResponse.json(
        {error: 'Please try again later'},
        {status: 200},
    )
//     } finally {
//         await prisma.$disconnect()
//     }
}

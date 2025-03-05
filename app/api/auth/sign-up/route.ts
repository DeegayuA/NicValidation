// import {NextResponse} from "next/server";
// import {PrismaClient} from "@prisma/client";
// import bcrypt from 'bcryptjs'
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
//         const isUserCreateBefore = await prisma.user.findUnique({where: {email}})
//         if (isUserCreateBefore) {
//             return NextResponse.json({error: 'The email address has been used before'}, {status: 200})
//         }
//
//         const hash = await bcrypt.hash(password, 10)
//
//         const user = await prisma.user.create({
//             data: {
//                 email: email.toLowerCase(),
//                 password: hash
//             }
//         })
//         if (!user) {
//             return NextResponse.json({error: 'An error occurred. please try again later'}, {status: 200})
//         }
//
//         return NextResponse.json(user, {status: 200})
//
//     } catch (e) {
            return NextResponse.json({error: 'An error occurred. please try again later'}, {status: 200})
//     } finally {
//         await prisma.$disconnect()
//     }
}

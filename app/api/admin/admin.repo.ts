import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

export async function createAdmin(data: any) {

    try {
        return await prisma.admin.create({
            data: {
                id: data.id,
                name: data.name,
                email: data.email,
                password: data.password,
                updatedAt: data.updatedAt
            }
        })
    } catch (e: any) {
        throw e;
    } finally {
        await prisma.$disconnect()
    }
}

export async function findFirstAdmin(email: string) {

    try {
        return await prisma.admin.findFirst({
            where: {
                email: email.toLowerCase()
            }
        })
    } catch (e: any) {
        throw e;
    } finally {
        await prisma.$disconnect()
    }
}

export async function findUniqueAdmin(id: string) {

    try {
        return await prisma.admin.findUnique({
                where: {
                    id: id
                }
            })
    } catch (e: any) {
        throw e;
    } finally {
        await prisma.$disconnect()
    }
}

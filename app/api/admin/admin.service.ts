import {createAdmin, findFirstAdmin, findUniqueAdmin} from "@/app/api/admin/admin.repo";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {cookies} from "next/headers";
import {LOGGED_TOKEN, LOGGED_USER, USER} from "@/lib/constants";
import {encrypt} from "@/lib/encryption";
import {JWT_EXPIRE_TIME, JWT_PRIVATE_KEY} from "@/app/api/authenticate";

export async function createAdminService(body: any) {

    try {
        const admin = await findFirstAdmin(body.email)
        if (admin) {
            throw new Error(`Admin email is already exist!`);
        }
        const hash = await bcrypt.hash(body.password, 10)
        const result = await createAdmin({...body, password: hash})
        result.password = '';
        return result
    } catch (e) {
        throw e;
    }
}

export async function loginAdminService(body: any) {

    try {
        const admin = await findFirstAdmin(body.email)
        if (!admin) {
            throw new Error(`Invalid admin credentials!`);
        }

        const validPassword = await bcrypt.compare(body.password, admin.password)
        if (!validPassword) {
            throw new Error(`Invalid credentials!`);
        }

        const token = jwt.sign({id: admin.id, user: USER.ADMIN}, JWT_PRIVATE_KEY, {expiresIn: JWT_EXPIRE_TIME});
        (await cookies()).set(LOGGED_TOKEN, encrypt(token));
        (await cookies()).set(LOGGED_USER, encrypt(USER.ADMIN));

        return {logging: true}
    } catch (e) {
        throw e
    }
}

export async function findAuthAdminService(id: any) {

    try {
        const admin = await findUniqueAdmin(id)
        return admin
    } catch (e) {
        throw e;
    }
}

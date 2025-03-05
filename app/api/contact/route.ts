import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'] // ✅ Enables Prisma query logging
});

export async function POST(request: any) {
    try {
        const body = await request.json();
        console.log("Received form data:", body); // ✅ Debugging

        if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.message) {
            return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
        }

        console.log("Inserting into database:", body); 

        const newContact = await prisma.contact.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                message: body.message
            },
        });

        console.log("Database insert successful:", newContact); // ✅ Confirm insert

        return NextResponse.json({ success: true, data: newContact }, { status: 200 });

    } catch (error: any) {
        console.error("Prisma Insert Error:", error);

        let errorMessage = "Internal Server Error";

        if (typeof error === "object" && error !== null) {
            if ("code" in error) {
                if (error.code === "P2002") {
                    errorMessage = "A contact with this email already exists.";
                } else {
                    errorMessage = `Prisma error code: ${error.code}`;
                }
            } else {
                errorMessage = JSON.stringify(error);
            }
        }

        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}

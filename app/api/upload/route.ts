import { NextResponse } from 'next/server';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import csv from 'csv-parser';

async function readCSV(filePath: string): Promise<string[]> {
    const results: string[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: { NIC: string; }) => {
                if (row.NIC) results.push(row.NIC);
            })
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function validateNIC(nic: string) {
    try {
        const response = await fetch(`https://nic-val-api.onrender.com/test-url?id=${nic}&nicVal=NIC-VAL`);
        return await response.json();
    } catch (error) {
        console.error("Validation error: ", error);
        return { error: "Validation failed" };
    }
}

export async function POST() {
    try {
        const uploadFolder = path.join(process.cwd(), "public/assets/uploads");
        const files = await fsPromises.readdir(uploadFolder);
        let allNICs: string[] = [];

        for (const file of files) {
            if (file.endsWith('.csv')) {
                const nicList = await readCSV(path.join(uploadFolder, file));
                allNICs.push(...nicList);
            }
        }

        const results = await Promise.all(allNICs.map(validateNIC));

        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json({ error: "Processing error" }, { status: 500 });
    }
}
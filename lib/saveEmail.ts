// pages/api/saveEmail.ts

import fs from 'fs';
import path from 'path';

export default function handler(req: { method: string; body: { email: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'public', 'temp.csv');

    // If the file doesn't exist, create it with the header
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, 'email\n');
    }

    // Append the new email to the CSV file
    fs.appendFileSync(filePath, `${email}\n`);

    return res.status(200).json({ message: 'Email saved successfully' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

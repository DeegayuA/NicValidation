import * as CryptoJS from 'crypto-js';
const key = {
    SECRET: 'iLiFqeklsiGhlL',
};

export function encrypt(field: any): string {
    return CryptoJS.AES.encrypt(field, key.SECRET).toString();
}

export function decrypt(cypherStr: any): string {
    const bytes = CryptoJS.AES.decrypt(
        cypherStr.toString(),
        key.SECRET,
    );
    return bytes.toString(CryptoJS.enc.Utf8);
}

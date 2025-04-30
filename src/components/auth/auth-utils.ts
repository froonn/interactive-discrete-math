import CryptoJS from "crypto-js";

export function generateSalt(length = 5): string {
  const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += symbols[Math.floor(Math.random() * symbols.length)];
  }
  return salt;
}

export function hashPassword(password: string, salt: string): string {
  const firstHash = CryptoJS.SHA256(password).toString();
  return CryptoJS.SHA256(firstHash + salt).toString();
}
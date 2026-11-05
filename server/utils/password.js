
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;
const MAX_PASSWORD_BYTES = 72;

function validatePassword(password) {
  if (typeof password !== "string" || !password) {
    throw new Error("Password must be a non-empty string.");
  }

  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    throw new Error("Password cannot exceed 72 bytes.");
  }
}

export async function hashPassword(password) {
  validatePassword(password);
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, passwordHash) {
  validatePassword(password);
  return bcrypt.compare(password, passwordHash);
}

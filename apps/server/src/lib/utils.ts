import bcrypt from "bcrypt";

export function hashPassword(password: string) {
  const rounds = 10;
  return bcrypt.hash(password, rounds);
}

export function checkPasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

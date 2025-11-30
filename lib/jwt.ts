// lib/jwt.ts
import jwt, { SignOptions } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your_secret_here";

// use type assertion for string literals
export const signToken = (payload: object, expiresIn: SignOptions['expiresIn'] = "1d") => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, SECRET, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};

import { jwt } from "hono/jwt";
import process from "node:process";

export const jwtMiddleware = jwt({ secret: process.env.JWT_SECRET! })

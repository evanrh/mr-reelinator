import { sign } from "hono/jwt";

export interface TokenCreationParams {
  userId: number;
  expiresIn?: number;
}

const signingSecret = process.env.JWT_SECRET!;

function expirationTime(minutes: number = 5) {
  return Math.floor(Date.now() / 1000) + 60 * minutes;
}

export function createAccessToken(params: TokenCreationParams) {
  const payload = {
    userId: params.userId,
    exp: params.expiresIn ?? expirationTime(),
  };
  return sign(payload, signingSecret, "HS256");
}

export function createRefreshToken(params: TokenCreationParams) {
  const payload = {
    userId: params.userId,
    exp: params.expiresIn ?? expirationTime(60 * 3),
  };
  return sign(payload, signingSecret, "HS256");
}

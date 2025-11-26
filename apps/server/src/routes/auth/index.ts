import { Hono } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import {
  authLoginResponseSchema,
  authLoginRequestSchema,
  authRegistrationSchema,
} from "./schemas.js";
import { AuthService } from "../../services/auth-service.js";
import {
  errorResponseSchema,
  genericSuccessResponseSchema,
} from "../../lib/common-schemas.js";

export const authRouter = new Hono();

const authService = new AuthService();

const openApiTags = ["Auth"];

authRouter
  .post(
    "/login",
    describeRoute({
      description: "Login user",
      tags: openApiTags,
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(authLoginResponseSchema) },
          },
        },
        403: {
          description: "Password mismatch",
          content: {
            "application/json": { schema: resolver(errorResponseSchema) },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": { schema: resolver(errorResponseSchema) },
          },
        },
      },
    }),
    validator("json", authLoginRequestSchema),
    async (c) => {
      const { err, accessToken, refreshToken } = await authService.login(
        c.req.valid("json"),
      );

      console.log(err);

      if (err === "User not found") {
        return c.json({ message: err }, 404);
      } else if (err === "Invalid Password") {
        return c.json({ message: err }, 403);
      }

      return c.json(
        { access_token: accessToken, refresh_token: refreshToken },
        200,
      );
    },
  )
  .post(
    "/register",
    describeRoute({
      description: "Register for an account",
      tags: openApiTags,
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: resolver(genericSuccessResponseSchema),
            },
          },
        },
        400: {
          description: "Bad request",
          content: {
            "application/json": { schema: resolver(errorResponseSchema) },
          },
        },
      },
    }),
    validator("json", authRegistrationSchema),
    async (c) => {
      const { err } = await authService.register(c.req.valid("json"));

      if (typeof err === "string") {
        return c.json({ message: err }, 400);
      }

      return c.json({ message: "success" }, 200);
    },
  );

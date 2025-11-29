import { Hono } from "hono";
import { describeRoute, validator, resolver } from "hono-openapi";
import {
  getUsersResponseSchema,
  UserCreationRequestSchema,
  UserCreationResponseSchema,
} from "./schemas.js";
import { jwtMiddleware } from "../../middleware/jwt-middleware.js";
import { commonBearerAuthProps } from "../../lib/openapi.js";
import { UsersService } from "../../services/users-service.js";

export const usersRouter = new Hono();
const usersService = new UsersService();

const openApiTags = ["Users"];

usersRouter.use(jwtMiddleware);
usersRouter
  .get(
    "/",
    describeRoute({
      description: "Get all users",
      tags: openApiTags,
      security: commonBearerAuthProps.security,
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: resolver(getUsersResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const res = await usersService.getUsers();
      return c.json(res.rows, 200);
    },
  )
  .post(
    "/",
    describeRoute({
      description: "Create a new user",
      tags: openApiTags,
      security: commonBearerAuthProps.security,
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: resolver(UserCreationResponseSchema),
            },
          },
        },
      },
    }),
    validator("json", UserCreationRequestSchema),
    async (c) => {
      const userBody = c.req.valid("json");
      console.log(userBody);
      return c.json({ id: 1 }, 200);
    },
  );

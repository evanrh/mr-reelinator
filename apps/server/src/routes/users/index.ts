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
import {
  collectPaginatedResponse,
  streamPaginatedResponse,
} from "../../lib/pagination.js";
import { paginationPropsSchema } from "../../schemas/pagination-props.js";
import { stream } from "hono/streaming";
import type { Writable } from "node:stream";

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
    validator("query", paginationPropsSchema),
    async (c) => {
      const pagination = c.req.valid("query");

      const resultStream = await usersService.getUsers();
      c.header("Content-Type", "application/json");
      return stream(c, async (stream) => {
        await streamPaginatedResponse({
          stream: resultStream,
          offset: pagination.offset,
          limit: pagination.limit,
          outputStream: stream,
        });
      });
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

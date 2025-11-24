import { Hono } from "hono";
import { describeRoute, validator, resolver } from "hono-openapi";
import { UserCreationRequestSchema, UserCreationResponseSchema } from "./schemas.js";
import { UsersDAO } from "../../data-access/users-data-access.js";

export const usersRouter = new Hono();
const usersDAO = new UsersDAO();

const openApiTags = ['Users'];

usersRouter
  .post(
    '/',
    describeRoute({
      description: 'Create a new user',
      tags: openApiTags,
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: resolver(UserCreationResponseSchema)
            }
          }
        }
      }
    }),
    validator('json', UserCreationRequestSchema),
    async (c) => {
      const userBody = c.req.valid('json')
      console.log(userBody);
      return c.json({ id: 1 }, 200);
    })

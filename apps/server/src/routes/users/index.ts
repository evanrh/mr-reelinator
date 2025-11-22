import { Hono } from "hono";
import { describeRoute, validator, resolver } from "hono-openapi";
import { UserCreationRequestSchema, UserCreationResponseSchema, UserLoginRequestSchema } from "./schemas.js";
import z from "zod";
import { UsersRepo } from "./repo.js";
import { checkPasswordHash } from "../../lib/utils.js";

export const usersRouter = new Hono();
const repo = new UsersRepo();

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
  .post(
    '/login',
    describeRoute({
      description: 'Login user',
      tags: openApiTags,
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'text/plain': { schema: resolver(z.string()) }
          }
        }
      }
    }),
    validator('json', UserLoginRequestSchema),
    async (c) => {
      const { username, password } = c.req.valid('json');
      const user = await repo.findUser(username);

      if (user?.id) {
        const passwordsMatch = await checkPasswordHash(password, user.password);
        if (passwordsMatch) {
          return c.text(user.id.toString(), 200)
        }
          return c.status(401)
      }
      return c.status(404)
    }
  )

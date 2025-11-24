import { Hono } from "hono";
import { UsersDAO } from "../../data-access/users-data-access.js";
import { describeRoute, resolver, validator } from "hono-openapi";
import { checkPasswordHash } from "../../lib/utils.js";
import { authLoginResponseSchema, authLoginRequestSchema } from "./schemas.js";
import { createAccessToken, createRefreshToken } from "../../lib/auth.js";

export const authRouter = new Hono();
const usersDAO = new UsersDAO();

const openApiTags = ['Auth'];

authRouter
  .post(
    '/login',
    describeRoute({
      description: 'Login user',
      tags: openApiTags,
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': { schema: resolver(authLoginResponseSchema) }
          }
        }
      }
    }),
    validator('json', authLoginRequestSchema),
    async (c) => {
      const params = c.req.valid('json');
      const user = await usersDAO.findUser(params);

      if (user?.id) {
        const passwordsMatch = await checkPasswordHash(params.password, user.password);
        if (!passwordsMatch) {
          return c.status(401)
        }

        const userId = user.id;
        const [accessToken, refreshToken] = await Promise.all([
          createAccessToken({ userId }),
          createRefreshToken({ userId })
        ]);
        return c.json(
          {
            accessToken,
            refreshToken,
          },
          200
        )
      }
      return c.status(404)
    }
  )

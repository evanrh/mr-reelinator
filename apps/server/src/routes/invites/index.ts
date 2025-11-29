import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { InvitesService } from "../../services/invites-service.js";
import { genericSuccessResponseSchema } from "../../lib/common-schemas.js";
import { jwtMiddleware } from "../../middleware/jwt-middleware.js";
import { commonBearerAuthProps } from "../../lib/openapi.js";

export const invitesRouter = new Hono();
const invitesService = new InvitesService();
const openApiTags = ["Invite Codes"];

invitesRouter.use(jwtMiddleware);
invitesRouter
  .get(
    "/",
    describeRoute({
      description: "Get all invite codes",
      tags: openApiTags,
      security: commonBearerAuthProps.security,
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: resolver(genericSuccessResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const res = await invitesService.getAllInvites();
      return c.json(res, 200);
    },
  )
  .get(
    "/:code",
    describeRoute({
      description: "Get a single invite code",
      tags: openApiTags,
      security: commonBearerAuthProps.security,
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: resolver(genericSuccessResponseSchema),
            },
          },
        },
      },
    }),
    async (c) => {
      const { code } = c.req.param();
      const res = await invitesService.getInvite(code);
      return c.json(res, 200);
    },
  );

import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { InvitesService } from "../../services/invites-service.js";
import { genericSuccessResponseSchema } from "../../lib/common-schemas.js";

export const invitesRouter = new Hono();
const invitesService = new InvitesService();
const openApiTags = ["Invite Codes"];

invitesRouter
  .get(
    "/",
    describeRoute({
      description: "Get all invite codes",
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

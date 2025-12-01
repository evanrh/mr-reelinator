import "dotenv/config";
import { serve, type HttpBindings } from "@hono/node-server";
import { Hono } from "hono";
import process from "node:process";
import { usersRouter } from "./routes/users/index.js";
import { openAPIRouteHandler } from "hono-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { getConnection } from "./lib/db/index.js";
import { authRouter } from "./routes/auth/index.js";
import { invitesRouter } from "./routes/invites/index.js";
import { requestId } from "hono/request-id";
import { pinoHttp } from "pino-http";

const app = new Hono<{ Bindings: HttpBindings }>();

app
  .use(requestId())
  .use(async (c, next) => {
    c.env.incoming.id = c.var.requestId;

    await new Promise<void>((resolve) =>
      pinoHttp({
        redact: {
          paths: ["req.headers"],
          remove: true,
        },
      })(c.env.incoming, c.env.outgoing, () => resolve()),
    );

    c.set("logger", c.env.incoming.log);
    await next();
  })
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/users", usersRouter)
  .route("/auth", authRouter)
  .route("/invites", invitesRouter)
  .get("/api", swaggerUI({ url: "/api/doc" }))
  .get(
    "/api/doc",
    openAPIRouteHandler(app, {
      documentation: {
        info: {
          title: "Mr. Reelinator API",
          version: "1.0.0",
          description: "Server processes",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        servers: [
          { url: "http://localhost:3000", description: "Local Server" },
        ],
      },
    }),
  );

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

server.on("listening", () => {
  getConnection();
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});

import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import type { IncomingMessage, ServerResponse } from "http";
import path from "path";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type DevVercelLikeResponse = {
  status: (code: number) => DevVercelLikeResponse;
  json: (payload: JsonValue) => void;
  setHeader: (name: string, value: string) => void;
};

type DevVercelLikeRequest = IncomingMessage & { query: Record<string, string> };

function createDevResponseAdapter(
  res: ServerResponse,
): DevVercelLikeResponse {
  return {
    status(code: number) {
      res.statusCode = code;
      return this;
    },
    json(payload: JsonValue) {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
      }
      res.end(JSON.stringify(payload));
    },
    setHeader(name: string, value: string) {
      res.setHeader(name, value);
    },
  };
}

function localFulfillApiPlugin(): Plugin {
  return {
    name: "local-fulfill-api",
    configureServer(server) {
      server.middlewares.use("/api/fulfill", async (req, res, next) => {
        try {
          const requestUrl = new URL(req.url ?? "/", "http://127.0.0.1:5173");
          const query = Object.fromEntries(requestUrl.searchParams.entries());
          const module = await server.ssrLoadModule("/api/fulfill.ts");
          const handler = module.default as (
            req: DevVercelLikeRequest,
            res: DevVercelLikeResponse,
          ) => Promise<void>;

          await handler(Object.assign(req, { query }), createDevResponseAdapter(res));
        } catch (error) {
          next(error);
        }
      });

      server.middlewares.use("/api/deliver", async (req, res, next) => {
        try {
          const requestUrl = new URL(req.url ?? "/", "http://127.0.0.1:5173");
          const query = Object.fromEntries(requestUrl.searchParams.entries());
          const module = await server.ssrLoadModule("/api/deliver.ts");
          const handler = module.default as (
            req: DevVercelLikeRequest,
            res: DevVercelLikeResponse,
          ) => Promise<void>;

          await handler(Object.assign(req, { query }), createDevResponseAdapter(res));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  // Derive VITE_PADDLE_ENVIRONMENT from server-side PADDLE_ENVIRONMENT
  // so that one env var controls both frontend and backend.
  const paddleEnv = (env.PADDLE_ENVIRONMENT ?? env.VITE_PADDLE_ENVIRONMENT ?? "live")
    .trim()
    .toLowerCase();

  return {
    define: {
      "import.meta.env.VITE_PADDLE_ENVIRONMENT": JSON.stringify(paddleEnv),
    },
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), localFulfillApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

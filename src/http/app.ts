import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import type { BuildInvoiceUseCase } from "../core/application/build-invoice-usecase";
import type { InvoicePreviewPort } from "../core/ports/invoice-preview-port";
import { invoiceApiRoutes } from "./routes/invoice-api-routes";
import { join } from "path";

interface HttpAppDeps {
  buildInvoiceUseCase: BuildInvoiceUseCase;
  previewRepository: InvoicePreviewPort;
}

export async function createHttpApp(deps: HttpAppDeps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  const app = new Elysia();

  app.use(cors());

  // Serve static assets from /static
  app.use(
    staticPlugin({
      assets: "src/web/public",
      prefix: "/web",
    })
  );

  app.get("/health", () => ({ status: "ok" }));
  app.use(invoiceApiRoutes(deps));

  return app;
}
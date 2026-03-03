import { Elysia, sse } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import type { BuildInvoiceUseCase } from "../core/application/build-invoice-usecase";
import type { InvoicePreviewPort } from "../core/ports/invoice-preview-port";
import { invoiceApiRoutes } from "./routes/invoice-api-routes";

interface HttpAppDeps {
  buildInvoiceUseCase: BuildInvoiceUseCase;
  previewRepository: InvoicePreviewPort;
}

export async function createApi(deps: HttpAppDeps) {
  const isDevelopment = process.env.NODE_ENV === "development";

  const app = new Elysia();

  app.use(
    cors({
      origin: "*",
    }),
  );

  app.get("/health", () => ({ status: "ok" }));
  app.use(invoiceApiRoutes(deps));

  return app;
}

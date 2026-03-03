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

  app.use(cors());

  // if (isDevelopment) {
  //   watchStaticAssets();

  //   // SSE Endpoint for Live Reload
  //   app.get("/api/_livereload", async function* ({ request }) {
  //     yield sse("ping");
  //     const queue: string[] = [];

  //     buildEvents.on("built", () => queue.push("reload"));

  //     const interval = setInterval(() => {
  //       try {
  //         queue.push("ping");
  //       } catch (err) {}
  //     }, 1000);

  //     request.signal.onabort = () => {
  //       clearInterval(interval);
  //     };

  //     while (true) {
  //       if (queue.length > 0) {
  //         yield sse(queue.shift()!);
  //       } else {
  //         await new Promise((resolve) => setTimeout(resolve, 1));
  //       }
  //     }
  //   });
  // }

  app.get("/health", () => ({ status: "ok" }));
  app.use(invoiceApiRoutes(deps));

  return app;
}

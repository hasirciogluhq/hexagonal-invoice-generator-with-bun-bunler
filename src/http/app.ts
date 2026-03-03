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

  // Serve the React app index.html at root
  app.get("/", async () => {
    // In dev, we might want to build the static assets first
    if (isDevelopment) {
      await buildStaticAssets();
    }
    return Bun.file("src/web/public/index.html");
  });

  app.get("/health", () => ({ status: "ok" }));
  app.use(invoiceApiRoutes(deps));

  return app;
}

async function buildStaticAssets() {
  console.log("Building static assets...");
  try {
    const result = await Bun.build({
      entrypoints: ["src/web/public/index.tsx"],
      outdir: "static",
      naming: "app.js",
      minify: false,
      sourcemap: "inline",
    });
    
    if (!result.success) {
      console.error("Build failed", result.logs);
    }
  } catch (e) {
    console.error("Error building static assets", e);
  }
}

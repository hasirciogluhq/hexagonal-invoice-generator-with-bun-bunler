import { BuildInvoiceUseCase } from "./src/core/application/build-invoice-usecase";
import { InMemoryInvoicePreviewRepository } from "./src/core/adapters/in-memory-invoice-preview-repository";
import { createApi } from "./src/http/app";
import indexFile from "./src/web/public/index.html";


const port = Number(Bun.env.PORT ?? 3000);

const elysiaApi = await createApi({
  buildInvoiceUseCase: new BuildInvoiceUseCase(),
  previewRepository: new InMemoryInvoicePreviewRepository(),
});

// if (process.env.NODE_ENV !== "production") {
//   mkdir("./dist/web", { recursive: true }, (err) => {
//     if (err) throw err;
//   });
//   await buildStaticAssets();
// }

Bun.serve({
  port,
  routes: {
    "/api/*": elysiaApi.fetch,
    "/*": indexFile,
  },
  fetch: async (req, res) => {
    if (req.url.includes("/_static")) {
      return new Response(
        Bun.file("./dist/web" + req.url.split("/_static")[1]),
      );
    }
    return new Response("not found", { status: 404 });
  },
  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Invoice service running at http://localhost:${port}`);

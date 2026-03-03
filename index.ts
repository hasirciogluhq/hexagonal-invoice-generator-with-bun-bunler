import { BuildInvoiceUseCase } from "./src/core/application/build-invoice-usecase";
import { InMemoryInvoicePreviewRepository } from "./src/core/adapters/in-memory-invoice-preview-repository";
import { createHttpApp } from "./src/http/app";
import { mkdir } from "fs";
import { buildStaticAssets } from "@/http/static/build-static-assets";

const port = Number(Bun.env.PORT ?? 3000);

if (process.env.NODE_ENV !== "production") {
  mkdir("./dist/web", { recursive: true }, (err) => {
    if (err) throw err;
  });
  await buildStaticAssets();
}

const app = await createHttpApp({
  buildInvoiceUseCase: new BuildInvoiceUseCase(),
  previewRepository: new InMemoryInvoicePreviewRepository(),
});

app.listen(port);

console.log(`Invoice service running at http://localhost:${port}`);

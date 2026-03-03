import { BuildInvoiceUseCase } from "./src/core/application/build-invoice-usecase";
import { InMemoryInvoicePreviewRepository } from "./src/core/adapters/in-memory-invoice-preview-repository";
import { createHttpApp } from "./src/http/app";

const port = Number(Bun.env.PORT ?? 3000);

const app = await createHttpApp({
  buildInvoiceUseCase: new BuildInvoiceUseCase(),
  previewRepository: new InMemoryInvoicePreviewRepository(),
});

app.listen(port);

console.log(`Invoice service running at http://localhost:${port}`);

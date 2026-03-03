import { Elysia } from "elysia";
import type { BuildInvoiceUseCase } from "../../core/application/build-invoice-usecase";
import type { InvoicePreviewPort } from "../../core/ports/invoice-preview-port";

interface InvoiceApiDeps {
  buildInvoiceUseCase: BuildInvoiceUseCase;
  previewRepository: InvoicePreviewPort;
}

export function invoiceApiRoutes(deps: InvoiceApiDeps) {
  const app = new Elysia({ prefix: "/api" });

  const handler = () => {
    const params = deps.previewRepository.getPreviewParams();
    return deps.buildInvoiceUseCase.execute(params);
  };

  return app
    .get("/invoice", handler)
    .get("/invocie", handler)
    .post("/invoice", ({ body }) => {
      return deps.buildInvoiceUseCase.execute(body as any);
    });
}

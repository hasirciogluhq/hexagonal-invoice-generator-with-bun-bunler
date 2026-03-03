import type { BuildInvoiceParams } from "../domain/invoice";
import type { InvoicePreviewPort } from "../ports/invoice-preview-port";

export class InMemoryInvoicePreviewRepository implements InvoicePreviewPort {
  getPreviewParams(): BuildInvoiceParams {
    return {
      lineItems: [
        { id: "prod_starter", description: "Starter Plan", qty: 3, unitPrice: 49 },
        { id: "prod_storage", description: "Extra Storage", qty: 1, unitPrice: 19 },
        { id: "prod_support", description: "Priority Support", qty: 1, unitPrice: 79 },
      ],
      coupon: {
        code: "SAVE5",
        type: "fixed",
        scope: "products",
        amount: 5,
        productIds: ["prod_starter", "prod_storage"],
      },
    };
  }
}

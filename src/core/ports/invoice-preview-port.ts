import type { BuildInvoiceParams } from "../domain/invoice";

export interface InvoicePreviewPort {
  getPreviewParams(): BuildInvoiceParams;
}

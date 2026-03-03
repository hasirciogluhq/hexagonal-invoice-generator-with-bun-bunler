import type { BuildInvoiceParams, BuiltInvoice } from "../domain/invoice";
import { buildInvoice } from "../domain/invoice";

export class BuildInvoiceUseCase {
  execute(params: BuildInvoiceParams): BuiltInvoice {
    return buildInvoice(params);
  }
}

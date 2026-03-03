export type CouponScope = "all" | "products";
export type CouponType = "fixed" | "percent";

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Coupon {
  code: string;
  type: CouponType;
  scope: CouponScope;
  amount: number;
  productIds?: string[];
}

export interface BuildInvoiceParams {
  lineItems: InvoiceItem[];
  coupon?: Coupon;
}

export interface BuiltInvoiceLineItem extends InvoiceItem {
  amount: number;
}

export interface BuiltInvoice {
  lineItems: BuiltInvoiceLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon?: Coupon;
}

const toMoney = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round(value * 100) / 100;
};

const clampNonNegative = (value: number): number => Math.max(0, value);

function getEligibleSubtotal(lineItems: BuiltInvoiceLineItem[], coupon: Coupon): number {
  if (coupon.scope === "all") {
    return lineItems.reduce((acc, item) => acc + item.amount, 0);
  }

  const allowedIds = new Set(coupon.productIds ?? []);
  if (allowedIds.size === 0) {
    return 0;
  }

  return lineItems
    .filter((item) => allowedIds.has(item.id))
    .reduce((acc, item) => acc + item.amount, 0);
}

function computeRawDiscount(eligibleSubtotal: number, coupon: Coupon): number {
  if (coupon.type === "fixed") {
    return coupon.amount;
  }
  return (eligibleSubtotal * coupon.amount) / 100;
}

export function buildInvoice(params: BuildInvoiceParams): BuiltInvoice {
  const lineItems: BuiltInvoiceLineItem[] = params.lineItems.map((item) => {
    const qty = clampNonNegative(item.qty);
    const unitPrice = clampNonNegative(item.unitPrice);
    const amount = toMoney(qty * unitPrice);

    return {
      ...item,
      qty,
      unitPrice,
      amount,
    };
  });

  const subtotal = toMoney(lineItems.reduce((acc, item) => acc + item.amount, 0));

  let discount = 0;
  if (params.coupon) {
    const eligibleSubtotal = toMoney(getEligibleSubtotal(lineItems, params.coupon));
    const rawDiscount = toMoney(computeRawDiscount(eligibleSubtotal, params.coupon));
    discount = toMoney(Math.min(rawDiscount, eligibleSubtotal));
  }

  const total = toMoney(Math.max(0, subtotal - discount));

  return {
    lineItems,
    subtotal,
    discount,
    total,
    coupon: params.coupon,
  };
}

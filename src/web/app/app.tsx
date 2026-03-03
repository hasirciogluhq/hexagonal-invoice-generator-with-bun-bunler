import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Plus, Trash2, ArrowLeft, Receipt, CheckCircle2, ChevronRight, Tags, ArrowRight, Sparkles } from "lucide-react";

// --- TYPES ---
interface InvoiceItem {
    id: string;
    description: string;
    qty: number;
    unitPrice: number;
}

interface Coupon {
    code: string;
    type: "fixed" | "percent";
    scope: "all" | "products";
    amount: number;
}

interface BuiltInvoice {
    lineItems: (InvoiceItem & { amount: number })[];
    subtotal: number;
    discount: number;
    total: number;
    coupon?: Coupon;
}

// --- LANDING PAGE ---
function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <nav className="border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <Receipt className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">InvoiceGen</span>
                </div>
                <Link to="/generator">
                    <Button variant="ghost" className="text-slate-600 font-medium">Sign in</Button>
                </Link>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-8 border border-indigo-100">
                    <Sparkles className="w-3 h-3" />
                    <span>Now with Hexagonal Architecture</span>
                </div>
                <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                    Professional invoices <br />
                    <span className="text-indigo-600">for your modern business.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Generate, preview and manage your invoices with the world's most elegant generator. 
                    Built with Bun, Elysia, and Stripe-inspired design.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/generator">
                        <Button className="px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold shadow-xl shadow-indigo-100 transition-all rounded-xl flex gap-2">
                            Start Generating <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Button variant="outline" className="px-8 py-6 text-lg font-bold border-slate-200 rounded-xl">
                        View Demo
                    </Button>
                </div>
                
                <div className="mt-20 relative px-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center text-slate-300">
                        <Receipt className="w-32 h-32 opacity-10" />
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- GENERATOR PAGE ---
function GeneratorPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<"input" | "preview">("input");
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [newItem, setNewItem] = useState({ description: "", qty: 1, unitPrice: 0 });
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [couponInput, setCouponInput] = useState({ code: "", amount: 0, type: "percent" as const });
    const [builtInvoice, setBuiltInvoice] = useState<BuiltInvoice | null>(null);
    const [loading, setLoading] = useState(false);

    const addItem = () => {
        if (!newItem.description || newItem.qty <= 0) return;
        setItems([...items, { ...newItem, id: Math.random().toString(36).substr(2, 9) }]);
        setNewItem({ description: "", qty: 1, unitPrice: 0 });
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const generateInvoice = async () => {
        setLoading(true);
        try {
            const payload = { 
                lineItems: items,
                ...(coupon ? { coupon } : {})
            };
            const response = await fetch("/api/invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            setBuiltInvoice(data);
            setStep("preview");
            window.scrollTo(0, 0);
        } catch (error) {
            console.error("Failed to generate invoice", error);
        } finally {
            setLoading(false);
        }
    };

    const applyCoupon = () => {
        if (!couponInput.code || couponInput.amount <= 0) return;
        setCoupon({
            code: couponInput.code,
            amount: couponInput.amount,
            type: couponInput.type,
            scope: "all"
        });
    };

    if (step === "preview" && builtInvoice) {
        return (
            <div className="min-h-screen bg-[#f6f9fc] text-[#1a1f36] antialiased pb-20">
                <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        <Button variant="ghost" onClick={() => setStep("input")} className="text-slate-500 flex gap-2 pl-0">
                            <ArrowLeft className="w-4 h-4" /> Back to Edit
                        </Button>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="text-slate-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                Items
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                            <span className="text-indigo-600 flex items-center gap-1">
                                <span className="w-5 h-5 rounded-full border border-indigo-600 flex items-center justify-center text-[10px]">2</span>
                                Preview
                            </span>
                        </div>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto px-6">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
                        <div className="p-12 border-b border-slate-100">
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                                        <Receipt className="text-white w-7 h-7" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoice</h1>
                                        <p className="text-slate-400 text-sm">#INV-{Math.floor(100000 + Math.random() * 900000)}</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-100">
                                        Draft Preview
                                    </div>
                                    <p className="text-sm text-slate-500 pt-2">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Issued By</h3>
                                    <p className="font-bold text-slate-800">Your Business Name</p>
                                    <p className="text-sm text-slate-500">hello@yourcompany.com</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
                                    <p className="font-bold text-slate-800">Customer Name</p>
                                    <p className="text-sm text-slate-500">customer@email.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-12 py-8">
                            <table className="w-full text-left">
                                <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="py-4 border-b border-slate-100">Description</th>
                                        <th className="py-4 text-right border-b border-slate-100 w-20">Qty</th>
                                        <th className="py-4 text-right border-b border-slate-100 w-28">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {builtInvoice?.lineItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-6 text-sm font-medium text-slate-700">{item.description}</td>
                                            <td className="py-6 text-sm text-slate-500 text-right">{item.qty}</td>
                                            <td className="py-6 text-sm font-semibold text-slate-900 text-right">${item.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-50/80 p-12">
                            <div className="flex justify-end">
                                <div className="w-full max-w-[240px] space-y-4">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="text-slate-800">${builtInvoice?.subtotal.toFixed(2)}</span>
                                    </div>
                                    {builtInvoice?.discount && builtInvoice.discount > 0 ? (
                                        <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                            <span className="flex items-center gap-1 italic">Discount ({builtInvoice.coupon?.code})</span>
                                            <span>-${builtInvoice.discount.toFixed(2)}</span>
                                        </div>
                                    ) : null}
                                    <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-base font-bold text-slate-900">Amount Due</span>
                                        <span className="text-2xl font-bold text-indigo-600 tracking-tight">${builtInvoice?.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f9fc] text-[#1a1f36] antialiased pb-20">
            <header className="bg-white border-b border-slate-200 px-6 py-4 mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 outline-none group">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
                            <Receipt className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">InvoiceGen</span>
                    </button>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="text-indigo-600 flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full border border-indigo-600 flex items-center justify-center text-[10px]">1</span>
                            Items
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        <span className="text-slate-400 flex items-center gap-1">
                            <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">2</span>
                            Preview
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-semibold text-slate-900">Line Items</h2>
                                <p className="text-sm text-slate-500">Add products or services to your invoice</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-7">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Description</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                            placeholder="e.g. Website Redesign"
                                            value={newItem.description}
                                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Qty</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                            value={newItem.qty}
                                            onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
                                            <input
                                                type="number"
                                                className="w-full pl-6 pr-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                                value={newItem.unitPrice}
                                                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={addItem} variant="outline" className="w-full border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 flex gap-2">
                                    <Plus className="w-4 h-4" /> Add Line Item
                                </Button>
                            </div>
                            {items.length > 0 && (
                                <div className="border-t border-slate-100">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3">Item</th>
                                                <th className="px-4 py-3 text-right w-20">Qty</th>
                                                <th className="px-4 py-3 text-right w-24">Price</th>
                                                <th className="px-6 py-3 text-right w-16"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {items.map((item) => (
                                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.description}</td>
                                                    <td className="px-4 py-4 text-sm text-slate-500 text-right">{item.qty}</td>
                                                    <td className="px-4 py-4 text-sm text-slate-500 text-right">${item.unitPrice.toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                                <Tags className="w-4 h-4 text-indigo-500" />
                                <span>Promotions</span>
                            </div>
                            <div className="space-y-3">
                                <input type="text" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" placeholder="Coupon Code" value={couponInput.code} onChange={(e) => setCouponInput({ ...couponInput, code: e.target.value })} />
                                <div className="flex gap-2">
                                    <input type="number" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm" placeholder="Amount" value={couponInput.amount} onChange={(e) => setCouponInput({ ...couponInput, amount: parseFloat(e.target.value) || 0 })} />
                                    <select className="bg-white border border-slate-200 rounded-md px-2 py-2 text-sm focus:outline-none" value={couponInput.type} onChange={(e) => setCouponInput({ ...couponInput, type: e.target.value as any })}>
                                        <option value="percent">%</option>
                                        <option value="fixed">$</option>
                                    </select>
                                </div>
                                <Button variant="outline" className="w-full text-xs" onClick={applyCoupon} disabled={!couponInput.code}>Apply</Button>
                            </div>
                            {coupon && (
                                <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-3 py-2 rounded-md text-xs border border-emerald-100">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span className="font-bold">{coupon.code}</span>
                                        <span>(-{coupon.amount}{coupon.type === 'percent' ? '%' : '$'})</span>
                                    </div>
                                    <button onClick={() => setCoupon(null)} className="hover:text-emerald-900 underline">Remove</button>
                                </div>
                            )}
                        </div>
                        <Button className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 font-bold transition-all disabled:opacity-50" disabled={items.length === 0 || loading} onClick={generateInvoice}>
                            {loading ? "Creating..." : "Generate Preview"}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- MAIN APP COMPONENT ---
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/generator" element={<GeneratorPage />} />
            </Routes>
        </BrowserRouter>
    );
}

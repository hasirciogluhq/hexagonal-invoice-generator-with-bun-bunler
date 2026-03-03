import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Plus, Trash2, ReceiptText, ArrowLeft } from "lucide-react";

interface InvoiceItem {
    id: string;
    description: string;
    qty: number;
    unitPrice: number;
}

interface BuiltInvoice {
    lineItems: (InvoiceItem & { amount: number })[];
    subtotal: number;
    discount: number;
    total: number;
}

export default function App() {
    const [step, setStep] = useState<"input" | "preview">("input");
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [newItem, setNewItem] = useState({ description: "", qty: 1, unitPrice: 0 });
    const [builtInvoice, setBuiltInvoice] = useState<BuiltInvoice | null>(null);
    const [loading, setLoading] = useState(false);

    const addItem = () => {
        if (!newItem.description) return;
        setItems([...items, { ...newItem, id: Math.random().toString(36).substr(2, 9) }]);
        setNewItem({ description: "", qty: 1, unitPrice: 0 });
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const generateInvoice = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lineItems: items }),
            });
            const data = await response.json();
            setBuiltInvoice(data);
            setStep("preview");
        } catch (error) {
            console.error("Failed to generate invoice", error);
        } finally {
            setLoading(false);
        }
    };

    if (step === "preview" && builtInvoice) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
                <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <ReceiptText className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
                        </div>
                        <Button variant="outline" onClick={() => setStep("input")} className="flex gap-2">
                            <ArrowLeft className="w-4 h-4" /> Edit
                        </Button>
                    </div>

                    <div className="mb-8">
                        <div className="text-sm text-gray-500 uppercase font-semibold mb-2">Invoice Details</div>
                        <div className="text-gray-700">Date: {new Date().toLocaleDateString()}</div>
                        <div className="text-gray-700">Invoice #: {Math.floor(Math.random() * 10000).toString().padStart(6, '0')}</div>
                    </div>

                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b-2 border-gray-100 text-left">
                                <th className="py-3 text-sm font-semibold text-gray-600">Description</th>
                                <th className="py-3 text-sm font-semibold text-gray-600 text-right">Qty</th>
                                <th className="py-3 text-sm font-semibold text-gray-600 text-right">Price</th>
                                <th className="py-3 text-sm font-semibold text-gray-600 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {builtInvoice.lineItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50">
                                    <td className="py-4 text-gray-800">{item.description}</td>
                                    <td className="py-4 text-gray-800 text-right">{item.qty}</td>
                                    <td className="py-4 text-gray-800 text-right">${item.unitPrice.toFixed(2)}</td>
                                    <td className="py-4 font-medium text-gray-900 text-right">${item.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>${builtInvoice.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Discount:</span>
                                <span className="text-green-600">-${builtInvoice.discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                                <span>Total:</span>
                                <span>${builtInvoice.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <ReceiptText className="text-blue-600" />
                    Invoice Generator
                </h1>

                <div className="space-y-6">
                    <div className="grid grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="col-span-6 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Service or product name"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Qty</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.qty}
                                onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newItem.unitPrice}
                                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="col-span-2">
                            <Button onClick={addItem} className="w-full flex gap-2">
                                <Plus className="w-4 h-4" /> Add
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-gray-800">Items</h2>
                        {items.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                No items added yet.
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3 text-right">Qty</th>
                                            <th className="px-4 py-3 text-right">Price</th>
                                            <th className="px-4 py-3 text-right w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.qty}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 text-right">${item.unitPrice.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors"
                                                    >
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

                    <div className="pt-6 flex justify-end">
                        <Button
                            size="lg"
                            disabled={items.length === 0 || loading}
                            onClick={generateInvoice}
                            className="px-12 py-6 text-lg font-bold shadow-lg shadow-blue-200 bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? "Generating..." : "Generate Invoice"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

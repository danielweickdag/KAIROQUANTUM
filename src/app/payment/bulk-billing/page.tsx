"use client";

import { useState } from "react";
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Trade = {
  shares: number;
  contracts: number;
  tradeValue: number;
  paperDelivery?: boolean;
};

type BillingResponse = {
  success: boolean;
  invoiceId?: string;
  totalFee: number;
  breakdown?: any[];
  error?: string;
};

export default function BulkBillingPage() {
  const [userPlan, setUserPlan] = useState("pro");
  const [dryRun, setDryRun] = useState(true);
  const [details, setDetails] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [trades, setTrades] = useState<Trade[]>([
    { shares: 100, contracts: 5, tradeValue: 20000, paperDelivery: true },
    { shares: 50, contracts: 0, tradeValue: 10000, paperDelivery: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BillingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  async function runBilling() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: any = {
        userPlan,
        trades,
        details,
      };
      if (dryRun) {
        payload.dryRun = true;
      } else {
        if (customerId.trim().length === 0) {
          setError("customerId is required for live billing");
          setLoading(false);
          return;
        }
        payload.customerId = customerId.trim();
      }

      const res = await fetch(`${apiBase}/api/billing/bulk-trades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.error || `Request failed with status ${res.status}`);
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  function updateTrade(index: number, field: keyof Trade, value: number | boolean) {
    setTrades((prev) => {
      const copy = [...prev];
      // @ts-ignore
      copy[index][field] = value as any;
      return copy;
    });
  }

  function addTrade() {
    setTrades((prev) => [...prev, { shares: 0, contracts: 0, tradeValue: 0, paperDelivery: false }]);
  }

  function removeTrade(index: number) {
    setTrades((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Bulk Billing Test</h1>
      <p className="text-sm text-gray-600">Call the backend billing endpoint, view fee breakdowns, and optionally create a Stripe invoice (test mode).</p>

      <div className="space-y-4 border rounded p-4">
        <div className="flex items-center gap-4">
          <label className="font-medium">User Plan</label>
          <div className="w-48">
            <Select value={userPlan} onValueChange={(v) => setUserPlan(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">free</SelectItem>
                <SelectItem value="pro">pro</SelectItem>
                <SelectItem value="enterprise">enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="font-medium">Dry Run</label>
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
          />
          <span className="text-xs text-gray-500">When off, requires a valid Stripe customerId</span>
        </div>

        <div className="flex items-center gap-4">
          <label className="font-medium">Details</label>
          <input
            type="checkbox"
            checked={details}
            onChange={(e) => setDetails(e.target.checked)}
          />
          <span className="text-xs text-gray-500">Include per-trade breakdown in the response</span>
        </div>

        {!dryRun && (
          <div className="flex items-center gap-4">
            <label className="font-medium">Stripe Customer ID</label>
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="cus_..."
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-3 border rounded p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Trades</h2>
          <button className="border rounded px-2 py-1" onClick={addTrade}>Add Trade</button>
        </div>

        {trades.map((t, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end border rounded p-3">
            <div>
              <label className="text-xs text-gray-600">Shares</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={t.shares}
                onChange={(e) => updateTrade(i, "shares", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Contracts</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={t.contracts}
                onChange={(e) => updateTrade(i, "contracts", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Trade Value</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={t.tradeValue}
                onChange={(e) => updateTrade(i, "tradeValue", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.paperDelivery || false}
                onChange={(e) => updateTrade(i, "paperDelivery", e.target.checked)}
              />
              <span className="text-xs">Paper Delivery</span>
            </div>
            <div className="text-right">
              <button className="text-red-600 text-sm" onClick={() => removeTrade(i)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
          onClick={runBilling}
        >
          {loading ? "Processing..." : dryRun ? "Run Dry-Run" : "Create Invoice"}
        </button>
        <span className="text-xs text-gray-500">API: {apiBase}/api/billing/bulk-trades</span>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded p-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="border rounded p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total Fee:</span>
            <span>{result.totalFee}</span>
          </div>
          {result.invoiceId && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Invoice ID:</span>
              <span>{result.invoiceId}</span>
            </div>
          )}
          {Array.isArray(result.breakdown) && result.breakdown.length > 0 && (
            <div className="mt-2">
              <h3 className="font-medium mb-1">Breakdown</h3>
              <pre className="text-xs bg-gray-50 border rounded p-3 overflow-auto">
                {JSON.stringify(result.breakdown, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
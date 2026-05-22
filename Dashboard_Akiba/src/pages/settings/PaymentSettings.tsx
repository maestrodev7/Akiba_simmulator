import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getPaymentAmount,
  updatePaymentAmount,
} from "../../services/paymentService";
import { useCurrency } from "../../context/CurrencyContext";

export default function PaymentSettings() {
  const { fromXaf, toXaf, format, currency } = useCurrency();
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [amountXaf, setAmountXaf] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getPaymentAmount();
        if (response.success && response.data?.amount != null) {
          const xaf = response.data.amount;
          setAmountXaf(xaf);
          setDisplayAmount(String(fromXaf(xaf)));
        }
      } catch {
        setError("Impossible de charger le montant.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (amountXaf == null) return;
    setDisplayAmount(String(fromXaf(amountXaf)));
  }, [currency, amountXaf, fromXaf]);

  const onDisplayChange = (value: string) => {
    setDisplayAmount(value);
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setAmountXaf(toXaf(parsed));
    }
  };

  const onSave = async () => {
    if (amountXaf == null || amountXaf < 1) {
      setError("Montant invalide.");
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const response = await updatePaymentAmount(amountXaf);
      if (response.success) {
        const saved = response.data.amount;
        setAmountXaf(saved);
        setDisplayAmount(String(fromXaf(saved)));
        setMessage(`Montant enregistré : ${format(fromXaf(saved))}.`);
      }
    } catch {
      setError("Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#BB7A44]" size={40} />
      </div>
    );
  }

  return (
    <section className="p-6 max-w-xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[#000000]">Montant de la simulation</h1>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#344648]">Montant</label>
        <input
          type="number"
          min={1}
          value={displayAmount}
          onChange={(e) => onDisplayChange(e.target.value)}
          className="w-full bg-[#F5F5FA] px-4 py-3 rounded-md border border-gray-200"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {message && <p className="text-emerald-700 text-sm">{message}</p>}

      <button
        type="button"
        onClick={() => void onSave()}
        disabled={saving}
        className="px-6 py-2.5 rounded-md bg-[#BB7A44] text-white font-medium hover:bg-[#a16b43] disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </section>
  );
}

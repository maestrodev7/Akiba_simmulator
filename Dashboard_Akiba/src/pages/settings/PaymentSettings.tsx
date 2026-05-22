import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  fetchCurrencies,
  getPaymentAmount,
  updatePaymentAmount,
} from "../../services/paymentService";
import {
  type CurrencyCode,
  fromXaf,
  getCurrencyOptions,
  toXaf,
  formatMoney,
} from "../../lib/currency";

export default function PaymentSettings() {
  const [currency, setCurrency] = useState<CurrencyCode>("XAF");
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
        await fetchCurrencies();
        const response = await getPaymentAmount();
        if (response.success && response.data?.amount != null) {
          const xaf = response.data.amount;
          setAmountXaf(xaf);
          setDisplayAmount(String(fromXaf(xaf, currency)));
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
    setDisplayAmount(String(fromXaf(amountXaf, currency)));
  }, [currency, amountXaf]);

  const onDisplayChange = (value: string) => {
    setDisplayAmount(value);
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setAmountXaf(toXaf(parsed, currency));
    }
  };

  const onCurrencyChange = (next: CurrencyCode) => {
    const parsed = Number(displayAmount);
    if (!Number.isNaN(parsed) && parsed > 0) {
      const xaf = toXaf(parsed, currency);
      setAmountXaf(xaf);
      setDisplayAmount(String(fromXaf(xaf, next)));
    }
    setCurrency(next);
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
        setDisplayAmount(String(fromXaf(saved, currency)));
        setMessage(
          `Montant enregistré : ${formatMoney(fromXaf(saved, currency), currency)} (${saved.toLocaleString("fr-FR")} FCFA).`
        );
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
      <p className="text-sm text-[#8181A5]">
        Saisissez le montant dans la devise de votre choix. Il est toujours enregistré en FCFA (XAF) pour l&apos;API de paiement.
      </p>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-[#344648]">Devise</label>
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
          className="w-full bg-[#F5F5FA] px-4 py-3 rounded-md border border-gray-200"
        >
          {getCurrencyOptions().map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="block text-sm font-bold text-[#344648]">Montant</label>
        <input
          type="number"
          min={1}
          value={displayAmount}
          onChange={(e) => onDisplayChange(e.target.value)}
          className="w-full bg-[#F5F5FA] px-4 py-3 rounded-md border border-gray-200"
        />

        {amountXaf != null && (
          <p className="text-sm text-[#8181A5]">
            Équivalent API : <strong>{amountXaf.toLocaleString("fr-FR")} FCFA</strong>
          </p>
        )}
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

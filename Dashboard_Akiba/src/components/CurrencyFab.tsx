import { useEffect, useRef, useState } from "react";
import { useCurrency } from "../context/CurrencyContext";
import type { CurrencyCode } from "../lib/currency";

const SYMBOLS: Record<CurrencyCode, string> = {
  XAF: "FCFA",
  EUR: "€",
  USD: "$",
};

export default function CurrencyFab() {
  const { currency, setCurrency, options } = useCurrency();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {open && (
        <div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 min-w-[160px]"
          role="listbox"
          aria-label="Choisir une devise"
        >
          {options.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              aria-selected={currency === opt.code}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[#BB7A44]/10 ${
                currency === opt.code ? "text-[#BB7A44] bg-[#BB7A44]/5" : "text-[#344648]"
              }`}
              onClick={() => {
                setCurrency(opt.code);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-[#BB7A44] text-white shadow-lg hover:bg-[#a16b43] hover:shadow-xl transition-all flex items-center justify-center text-sm font-bold ring-4 ring-white"
        aria-expanded={open}
        aria-label="Changer de devise"
        title="Devise"
      >
        {SYMBOLS[currency]}
      </button>
    </div>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type CurrencyCode,
  formatMoney,
  fromXaf,
  getCurrencyOptions,
  toXaf,
} from "../lib/currency";
import { fetchCurrencies } from "../services/paymentService";

const STORAGE_KEY = "akiba_display_currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  options: { code: CurrencyCode; label: string }[];
  fromXaf: (amountXaf: number) => number;
  toXaf: (amount: number) => number;
  format: (amount: number) => string;
  formatBudget: (xaf: number | undefined | null) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    return saved === "EUR" || saved === "USD" || saved === "XAF" ? saved : "XAF";
  });

  useEffect(() => {
    void fetchCurrencies();
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      options: getCurrencyOptions(),
      fromXaf: (amountXaf: number) => fromXaf(amountXaf, currency),
      toXaf: (amount: number) => toXaf(amount, currency),
      format: (amount: number) => formatMoney(amount, currency),
      formatBudget: (xaf: number | undefined | null) => {
        if (xaf == null) return "";
        return formatMoney(fromXaf(xaf, currency), currency);
      },
    }),
    [currency, setCurrency]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

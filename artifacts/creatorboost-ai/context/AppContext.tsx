import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Plan = "free" | "premium" | "pro";

export interface HistoryItem {
  id: string;
  tool: string;
  category: string;
  input: string;
  output: string;
  timestamp: number;
  isFavorite: boolean;
}

interface AppContextType {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  dailyUsage: number;
  incrementUsage: () => boolean;
  resetDailyUsage: () => void;
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, "id" | "timestamp" | "isFavorite">) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  favorites: HistoryItem[];
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  PLAN: "cb_plan",
  DAILY_USAGE: "cb_daily_usage",
  USAGE_DATE: "cb_usage_date",
  HISTORY: "cb_history",
  GEMINI_KEY: "cb_gemini_key",
};

const FREE_LIMIT = 5;
const PREMIUM_LIMIT = 30;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<Plan>("free");
  const [dailyUsage, setDailyUsage] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [geminiApiKey, setGeminiApiKeyState] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [planVal, usageVal, dateVal, historyVal, keyVal] =
        await AsyncStorage.multiGet([
          STORAGE_KEYS.PLAN,
          STORAGE_KEYS.DAILY_USAGE,
          STORAGE_KEYS.USAGE_DATE,
          STORAGE_KEYS.HISTORY,
          STORAGE_KEYS.GEMINI_KEY,
        ]);

      if (planVal[1]) setPlanState(planVal[1] as Plan);
      if (keyVal[1]) setGeminiApiKeyState(keyVal[1]);

      const today = new Date().toDateString();
      if (dateVal[1] === today && usageVal[1]) {
        setDailyUsage(parseInt(usageVal[1], 10));
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.USAGE_DATE, today);
        setDailyUsage(0);
      }

      if (historyVal[1]) {
        setHistory(JSON.parse(historyVal[1]));
      }
    } catch {}
  };

  const setPlan = useCallback(async (p: Plan) => {
    setPlanState(p);
    await AsyncStorage.setItem(STORAGE_KEYS.PLAN, p);
  }, []);

  const setGeminiApiKey = useCallback(async (key: string) => {
    setGeminiApiKeyState(key);
    await AsyncStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key);
  }, []);

  const getLimit = (p: Plan) => {
    if (p === "pro") return Infinity;
    if (p === "premium") return PREMIUM_LIMIT;
    return FREE_LIMIT;
  };

  const incrementUsage = useCallback((): boolean => {
    const limit = getLimit(plan);
    if (dailyUsage >= limit) return false;
    const newUsage = dailyUsage + 1;
    setDailyUsage(newUsage);
    AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE, String(newUsage));
    return true;
  }, [plan, dailyUsage]);

  const resetDailyUsage = useCallback(() => {
    setDailyUsage(0);
    AsyncStorage.setItem(STORAGE_KEYS.DAILY_USAGE, "0");
  }, []);

  const addHistoryItem = useCallback(
    async (item: Omit<HistoryItem, "id" | "timestamp" | "isFavorite">) => {
      const newItem: HistoryItem = {
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        isFavorite: false,
      };
      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, 200);
        AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const toggleFavorite = useCallback(async (id: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
  }, []);

  const favorites = history.filter((item) => item.isFavorite);

  return (
    <AppContext.Provider
      value={{
        plan,
        setPlan,
        dailyUsage,
        incrementUsage,
        resetDailyUsage,
        history,
        addHistoryItem,
        toggleFavorite,
        clearHistory,
        favorites,
        geminiApiKey,
        setGeminiApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

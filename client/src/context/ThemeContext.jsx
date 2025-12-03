import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "daylytics-theme";
const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

const getPreferredTheme = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const userTheme = stored === "light" || stored === "dark" ? stored : null;
  const resolved =
    userTheme ??
    (window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light");

  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme =
    resolved === "dark" ? "dark" : "light";

  return resolved;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getPreferredTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

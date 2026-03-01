export type ThemeMode = "light" | "dark" | "auto";

const THEME_KEY = "admin-theme-mode";

const getSystemTheme = (): "light" | "dark" => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

export const resolveTheme = (mode: ThemeMode): "light" | "dark" => {
  if (mode === "auto") {
    return getSystemTheme();
  }
  return mode;
};

export const getStoredThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "auto";
  const raw = window.localStorage.getItem(THEME_KEY);
  if (raw === "light" || raw === "dark" || raw === "auto") {
    return raw;
  }
  return "auto";
};

export const applyThemeMode = (mode: ThemeMode) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", mode);
  document.documentElement.style.colorScheme = resolveTheme(mode);
};

export const saveThemeMode = (mode: ThemeMode) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, mode);
};

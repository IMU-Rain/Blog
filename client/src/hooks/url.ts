const baseURL = String(import.meta.env.VITE_BASEURL || "").replace(/\/$/, "");
export const toAssetUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  const normalized = normalizePath(value);
  if (normalized.startsWith("/")) {
    return `${baseURL}${normalized}`;
  }
  return `${baseURL}/${normalized}`;
};
const normalizePath = (value?: string) => {
  if (!value) return "";
  return value.replace(/^\.\//, "/").replace(/^(\.\.\/)+/, "/");
};

const resolveServerOrigin = () => {
  const baseURL = import.meta.env.VITE_BASEURL;
  try {
    if (!baseURL) {
      return window.location.origin;
    }
    const base = new URL(baseURL);
    return base.origin;
  } catch {
    return window.location.origin;
  }
};

export const toAssetUrl = (rawUrl?: string) => {
  if (!rawUrl) return "";
  if (/^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }
  const normalizedPath = rawUrl
    .replace(/\\/g, "/")
    .replace(/^(\.\.\/)+/, "/")
    .replace(/^\.?\//, "/");
  const origin = resolveServerOrigin();
  return `${origin}${normalizedPath.startsWith("/") ? normalizedPath : `/${normalizedPath}`}`;
};

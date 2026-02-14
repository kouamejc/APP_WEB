const apiBase = (() => {
  const raw = process.env.REACT_APP_API_URL || "";
  if (!raw) return "";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
})();

export const buildApiUrl = (path) => {
  const base = apiBase ? `${apiBase}/api${path}` : `/api${path}`;
  return base;
};

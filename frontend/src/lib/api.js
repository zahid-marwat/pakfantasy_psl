const sanitizeBaseUrl = (value) => {
  if (!value) return 'http://localhost:5000';
  const trimmed = value.trim();
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const API_BASE_URL = sanitizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const SOCKET_URL = sanitizeBaseUrl(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL) || API_BASE_URL;

export const buildApiUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

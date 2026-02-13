window.Api = {
  baseUrl: window.location.origin,
  apiPrefix: '/api',
  url(path) { return `${this.baseUrl}${this.apiPrefix}${path}`; },
  async request(path, options = {}) {
    const res = await fetch(this.url(path), {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    const raw = await res.text();
    let data;
    try { data = JSON.parse(raw); } catch { data = raw; }
    return { ok: res.ok, status: res.status, statusText: res.statusText, data };
  },
};

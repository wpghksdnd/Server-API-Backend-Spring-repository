const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

function emitAuthEvent(name) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(name))
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (res.status === 401 && path !== '/login') {
    emitAuthEvent('auth:expired')
  }

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { ok: res.ok, status: res.status, data }
}

export const api = {
  listPosts: ({ page = 1, limit = 100 } = {}) => request(`/posts?page=${page}&limit=${limit}`),
  getPost: (id) => request(`/posts/${id}`),
  updatePost: (id, payload) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  listComments: (id) => request(`/posts/${id}/comments?limit=50`),
  createComment: (postId, payload) => request(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(payload) }),
  myComments: (limit = 50) => request(`/comments/me?limit=${limit}`),
  opsHealth: () => request('/ops/health'),
  notificationComments: (limit = 20) => request(`/notifications/comments?limit=${limit}`),
  notificationUnreadCount: () => request('/notifications/comments/unread-count'),
  notificationMarkRead: (lastSeenCommentId) => request('/notifications/comments/mark-read', {
    method: 'POST',
    body: JSON.stringify(lastSeenCommentId ? { lastSeenCommentId } : {}),
  }),
  adsAll: () => request('/ads'),
  adsBySlot: (slot) => request(`/ads/slots/${slot}`),
  adCreate: (payload) => request('/ads', { method: 'POST', body: JSON.stringify(payload) }),
  adUpdate: (id, payload) => request(`/ads/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  adDelete: (id) => request(`/ads/${id}`, { method: 'DELETE' }),
  adClick: (id) => request(`/ads/${id}/click`, { method: 'POST' }),
  getEngagement: (postId) => request(`/posts/${postId}/engagement`),
  likePost: (postId) => request(`/posts/${postId}/like`, { method: 'POST' }),
  unlikePost: (postId) => request(`/posts/${postId}/like`, { method: 'DELETE' }),
  bookmarkPost: (postId) => request(`/posts/${postId}/bookmark`, { method: 'POST' }),
  unbookmarkPost: (postId) => request(`/posts/${postId}/bookmark`, { method: 'DELETE' }),
  listLikedUsers: (postId, limit = 20) => request(`/posts/${postId}/likes/users?limit=${limit}`),
  myBookmarks: (limit = 20) => request(`/posts/bookmarks/me?limit=${limit}`),

  login: (payload) => request('/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
  adminMe: () => request('/admin/me'),
  adminSummary: () => request('/admin/summary'),
  adminRecentActions: (limit = 15) => request(`/admin/recent-actions?limit=${limit}`),
  signup: (payload) => request('/users', { method: 'POST', body: JSON.stringify(payload) }),

  createPost: (payload) => request('/posts', { method: 'POST', body: JSON.stringify(payload) }),
}

export function notifyAuthChanged() {
  emitAuthEvent('auth:changed')
}

const { createApp } = Vue;
createApp({
  data: () => ({ post: null, comments: [] }),
  async mounted() {
    const id = Number(new URLSearchParams(location.search).get('id') || 1);
    const p = await Api.request(`/posts/${id}`);
    this.post = p?.data?.data || null;
    const c = await Api.request(`/posts/${id}/comments?limit=20`);
    this.comments = c?.data?.data || [];
  },
}).mount('#app');

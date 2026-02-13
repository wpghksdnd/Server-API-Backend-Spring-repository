const { createApp } = Vue;
createApp({
  data: () => ({ posts: [] }),
  async mounted() {
    const r = await Api.request('/posts?page=1&limit=20');
    this.posts = r?.data?.data || [];
  },
}).mount('#app');

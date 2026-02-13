const { createApp } = Vue;
createApp({
  data: () => ({ me: null, msg: '' }),
  methods: {
    async loadMe() {
      const r = await Api.request('/me');
      this.me = r?.data?.data || null;
      this.msg = r.ok ? '조회 성공' : `조회 실패 (${r.status})`;
    },
    async logout() {
      const r = await Api.request('/logout', { method: 'POST' });
      this.msg = r.ok ? '로그아웃 되었습니다.' : `로그아웃 실패 (${r.status})`;
      if (r.ok) setTimeout(() => location.href = '/login.html', 500);
    },
  },
  mounted() { this.loadMe(); },
}).mount('#app');

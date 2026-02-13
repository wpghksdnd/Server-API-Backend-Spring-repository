const { createApp } = Vue;
createApp({
  data: () => ({ username: '', password: '', msg: '' }),
  methods: {
    async login() {
      const r = await Api.request('/login', { method: 'POST', body: JSON.stringify({ username: this.username, password: this.password }) });
      this.msg = r.ok ? '로그인 성공! /me로 이동합니다.' : `로그인 실패 (${r.status})`;
      if (r.ok) setTimeout(() => location.href = '/me.html', 500);
    },
  },
}).mount('#app');

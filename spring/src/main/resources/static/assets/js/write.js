const { createApp } = Vue;
createApp({
  data: () => ({ title: '', content: '', msg: '' }),
  methods: {
    async submit() {
      const r = await Api.request('/posts', { method: 'POST', body: JSON.stringify({ title: this.title, content: this.content }) });
      this.msg = r.ok ? '등록 완료! 목록으로 이동합니다.' : `등록 실패 (${r.status}) - 로그인 필요할 수 있어요.`;
      if (r.ok) setTimeout(() => location.href = '/posts.html', 500);
    },
  },
}).mount('#app');

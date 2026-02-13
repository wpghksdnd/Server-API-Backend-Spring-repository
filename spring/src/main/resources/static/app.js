const { createApp } = Vue;

createApp({
  data() {
    return {
      baseUrl: window.location.origin,
      apiPrefix: '/api',
      output: '대기 중...',
      login: { username: '', password: '' },
      newPost: { title: '', content: '' },
      posts: [],
      comments: [],
      postId: 1,
      selectedPost: null,
      openComposer: false,
      loading: false,
      toast: '',
      healthOk: true,
    };
  },
  methods: {
    notify(msg) {
      this.toast = msg;
      setTimeout(() => (this.toast = ''), 1800);
    },
    api(path) {
      return `${this.baseUrl}${this.apiPrefix}${path}`;
    },
    async request(path, options = {}) {
      this.loading = true;
      try {
        const res = await fetch(this.api(path), {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
          ...options,
        });

        const raw = await res.text();
        let data;
        try { data = JSON.parse(raw); } catch { data = raw; }

        this.output = JSON.stringify({
          request: { method: options.method || 'GET', url: this.api(path) },
          response: { ok: res.ok, status: res.status, statusText: res.statusText, data },
        }, null, 2);

        this.healthOk = res.ok;
        return { ok: res.ok, status: res.status, data };
      } catch (e) {
        this.healthOk = false;
        this.output = JSON.stringify({
          request: { method: options.method || 'GET', url: this.api(path) },
          error: e?.message || String(e),
        }, null, 2);
        return { ok: false, error: e?.message || String(e) };
      } finally {
        this.loading = false;
      }
    },

    async listPosts() {
      const r = await this.request('/posts?page=1&limit=20');
      this.posts = r?.data?.data || [];
      this.notify('게시글 목록을 불러왔어요');
    },
    async getPost() {
      const id = this.postId || 1;
      const r = await this.request(`/posts/${id}`);
      this.selectedPost = r?.data?.data || null;
      this.notify('게시글 상세 조회 완료');
    },
    async listComments() {
      const id = this.postId || 1;
      const r = await this.request(`/posts/${id}/comments?limit=20`);
      this.comments = r?.data?.data || [];
      this.notify(`댓글 ${this.comments.length}개를 불러왔어요`);
    },
    async createPost() {
      if (!this.newPost.title || !this.newPost.content) {
        this.notify('제목과 내용을 입력해주세요');
        return;
      }
      const r = await this.request('/posts', {
        method: 'POST',
        body: JSON.stringify(this.newPost),
      });
      if (r.ok) {
        this.notify('게시글이 등록됐어요');
        this.newPost = { title: '', content: '' };
        this.openComposer = false;
        this.listPosts();
      } else {
        this.notify('게시글 등록 실패 (로그인 확인)');
      }
    },
    async loginApi() {
      const r = await this.request('/login', {
        method: 'POST',
        body: JSON.stringify(this.login),
      });
      this.notify(r.ok ? '로그인 성공' : '로그인 실패');
    },
    async logoutApi() {
      const r = await this.request('/logout', { method: 'POST' });
      this.notify(r.ok ? '로그아웃 되었어요' : '로그아웃 실패');
    },
    async meApi() {
      const r = await this.request('/me');
      this.notify(r.ok ? '내 정보 조회 성공' : '인증이 필요해요');
    },
    selectPost(id) {
      this.postId = id;
      this.getPost();
    },
  },
  mounted() {
    this.listPosts();
  },
}).mount('#app');

import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import Seo from '../components/Seo'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import Toast from '../components/Toast'
import EmptyState from '../components/EmptyState'

export default function PostDetailPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [replyTarget, setReplyTarget] = useState(null)
  const [replyInput, setReplyInput] = useState('')
  const [msg, setMsg] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [me, setMe] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [engagement, setEngagement] = useState({ liked: false, bookmarked: false, likeCount: 0, bookmarkCount: 0 })
  const [likedUsers, setLikedUsers] = useState([])

  const showToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(''), 1600)
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [p, c, e, lu, meRes] = await Promise.all([
        api.getPost(id),
        api.listComments(id),
        api.getEngagement(id),
        api.listLikedUsers(id, 20),
        api.me(),
      ])

      if (!p.ok) {
        setError(`게시글 조회 실패 (${p.status})`)
        return
      }

      const postData = p?.data?.data || null
      setPost(postData)
      setEditTitle(postData?.title || '')
      setEditContent(postData?.content || '')
      setComments(c?.data?.data || [])
      setEngagement(e?.data?.data || { liked: false, bookmarked: false, likeCount: 0, bookmarkCount: 0 })
      setLikedUsers(lu?.data?.data || [])
      setMe(meRes?.ok ? meRes?.data?.data : null)
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const rootComments = useMemo(() => comments.filter((c) => !c.parentId), [comments])
  const repliesMap = useMemo(() => {
    const map = new Map()
    comments.filter((c) => c.parentId).forEach((r) => {
      const arr = map.get(r.parentId) || []
      arr.push(r)
      map.set(r.parentId, arr)
    })
    return map
  }, [comments])

  const isOwner = me?.id && post?.userId && me.id === post.userId

  const submitComment = async () => {
    if (!commentInput.trim()) return
    const r = await api.createComment(id, { content: commentInput })
    if (r.ok) {
      setMsg('댓글 등록 완료')
      setCommentInput('')
      load()
    } else if (r.status === 401) {
      setMsg('세션이 만료되었습니다. 다시 로그인해 주세요.')
    } else {
      setMsg(`댓글 등록 실패 (${r.status})`)
    }
  }

  const submitReply = async () => {
    if (!replyInput.trim() || !replyTarget) return
    const r = await api.createComment(id, { content: replyInput, parentId: replyTarget })
    if (r.ok) {
      setMsg('대댓글 등록 완료')
      setReplyInput('')
      setReplyTarget(null)
      load()
    } else if (r.status === 401) {
      setMsg('세션이 만료되었습니다. 다시 로그인해 주세요.')
    } else {
      setMsg(`대댓글 등록 실패 (${r.status})`)
    }
  }

  const toggleLike = async () => {
    const r = engagement.liked ? await api.unlikePost(id) : await api.likePost(id)
    if (!r.ok) return setMsg(r.status === 401 ? '세션이 만료되었습니다. 다시 로그인해 주세요.' : `좋아요 처리 실패 (${r.status})`)
    showToast('좋아요 상태가 변경되었습니다.')
    load()
  }

  const toggleBookmark = async () => {
    const r = engagement.bookmarked ? await api.unbookmarkPost(id) : await api.bookmarkPost(id)
    if (!r.ok) return setMsg(r.status === 401 ? '세션이 만료되었습니다. 다시 로그인해 주세요.' : `북마크 처리 실패 (${r.status})`)
    showToast('북마크 상태가 변경되었습니다.')
    load()
  }

  const saveEdit = async () => {
    const r = await api.updatePost(id, { title: editTitle, content: editContent })
    if (r.ok) {
      showToast('게시글이 수정되었습니다.')
      setEditMode(false)
      load()
    } else setMsg(`수정 실패 (${r.status})`)
  }

  const deletePost = async () => {
    const r = await api.deletePost(id)
    if (r.ok) {
      showToast('게시글이 삭제되었습니다.')
      nav('/posts')
    } else setMsg(`삭제 실패 (${r.status})`)
  }

  return (
    <div className="grid">
      <Seo title={`게시글 ${id} | Koreanit`} description="게시글 상세 및 댓글" />
      {loading && <LoadingState text="게시글을 불러오는 중..." />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && !error && (
        <>
          <article className="card">
            {!editMode ? (
              <>
                <h1>{post?.title || '제목 없음'}</h1>
                <p className="muted">글 ID {post?.id}</p>
                <p>{post?.content}</p>
              </>
            ) : (
              <div>
                <input className="input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <textarea className="textarea" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="button" onClick={saveEdit}>저장</button>
                  <button className="button secondary" onClick={() => setEditMode(false)}>취소</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button className="button" onClick={toggleLike}>{engagement.liked ? `♥ 좋아요 취소 (${engagement.likeCount})` : `♡ 좋아요 (${engagement.likeCount})`}</button>
              <button className="button secondary" onClick={toggleBookmark}>{engagement.bookmarked ? `★ 북마크 해제 (${engagement.bookmarkCount})` : `☆ 북마크 (${engagement.bookmarkCount})`}</button>
              {isOwner && !editMode && <button className="button" onClick={() => setEditMode(true)}>수정</button>}
              <button className="button outline" onClick={() => { navigator.clipboard.writeText(window.location.href); showToast('링크가 복사되었습니다.') }}>링크 복사</button>
              {isOwner && <button className="button danger" onClick={() => setConfirmDelete(true)}>삭제</button>}
            </div>

            <div style={{ marginTop: 12 }}>
              <p className="muted">좋아요 누른 사용자</p>
              <p>{likedUsers.length === 0 ? '아직 좋아요가 없습니다.' : likedUsers.map((u) => `${u.nickname || u.username}(@${u.username})`).join(', ')}</p>
            </div>
          </article>

          <section className="card animate-pop">
            <h3>댓글</h3>
            <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
              <textarea className="textarea" style={{ minHeight: 90 }} value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder="댓글을 입력하세요" />
              <button className="button" onClick={submitComment}>댓글 등록</button>
              <p className="muted">{msg}</p>
            </div>

            {rootComments.length === 0 ? <EmptyState title="댓글이 없습니다." description="첫 댓글을 남겨보세요." /> : rootComments.map((c) => (
              <div key={c.id} style={{ padding: '10px 0', borderTop: '1px solid #e4e8ca' }}>
                <p style={{ margin: '0 0 6px' }}>• {c.content}</p>
                <button className="button btn-sm secondary" onClick={() => setReplyTarget(c.id)}>답글</button>

                {(repliesMap.get(c.id) || []).map((r) => (
                  <div key={r.id} style={{ marginLeft: 22, marginTop: 8, paddingLeft: 10, borderLeft: '2px solid #d8e983' }}>
                    ↳ {r.content}
                  </div>
                ))}

                {replyTarget === c.id && (
                  <div style={{ marginTop: 8, marginLeft: 22 }}>
                    <textarea className="textarea" style={{ minHeight: 80 }} value={replyInput} onChange={(e) => setReplyInput(e.target.value)} placeholder="대댓글을 입력하세요" />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="button btn-sm" onClick={submitReply}>대댓글 등록</button>
                      <button className="button btn-sm secondary" onClick={() => { setReplyTarget(null); setReplyInput('') }}>취소</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      )}

      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>게시글 삭제 확인</h3>
            <p className="muted">삭제하면 되돌릴 수 없습니다.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="button" onClick={() => setConfirmDelete(false)}>취소</button>
              <button className="button danger" onClick={deletePost}>삭제</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  )
}

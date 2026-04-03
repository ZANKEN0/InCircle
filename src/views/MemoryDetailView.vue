<template>
  <main class="page-shell detail-page">
    <section class="memory-panel panel">
      <div class="topbar">
        <button type="button" class="ghost-button" @click="goBack">Kembali</button>
        <button
          v-if="canDeleteMemory"
          type="button"
          class="danger-button"
          @click="deleteMemory"
        >
          Hapus Memory
        </button>
      </div>

      <div v-if="statusError" class="status-message error" role="alert">{{ statusError }}</div>

      <div class="memory-copy">
        <div class="memory-head">
          <span class="memory-badge">Memory</span>
          <h1>{{ memory.title || 'Memuat detail...' }}</h1>
          <p>{{ memory.content }}</p>
        </div>

        <div class="meta-row">
          <small>Dibuat oleh {{ memory.User?.name || 'Tanpa nama' }}</small>
          <small v-if="memory.createdAt">{{ formatDate(memory.createdAt) }}</small>
        </div>
      </div>
    </section>

    <section class="comments-panel panel">
      <div class="section-heading">
        <div>
          <h2>Komentar</h2>
          <p>{{ comments.length }} komentar pada memory ini.</p>
        </div>
      </div>

      <form class="comment-form" @submit.prevent="addComment">
        <div class="field-group">
          <label for="comment">Tulis komentar</label>
          <textarea
            id="comment"
            v-model.trim="commentText"
            placeholder="Bagikan respons atau cerita lanjutan di sini..."
          ></textarea>
        </div>

        <button type="submit" :disabled="isSubmittingComment">
          {{ isSubmittingComment ? 'Mengirim...' : 'Kirim Komentar' }}
        </button>
      </form>

      <hr />

      <div v-if="isLoadingComments" class="empty-state">Memuat komentar...</div>
      <div v-else-if="comments.length === 0" class="empty-state">
        Belum ada komentar. Jadilah orang pertama yang menulis respons.
      </div>

      <div v-else class="comment-list">
        <article v-for="comment in comments" :key="comment.id" class="comment-card">
          <div class="comment-copy">
            <p>{{ comment.content }}</p>
            <small>
              {{ comment.User?.name || 'Tanpa nama' }}
              <span v-if="comment.createdAt"> | {{ formatDate(comment.createdAt) }}</span>
            </small>
          </div>

          <button
            v-if="canDeleteComment(comment)"
            type="button"
            class="comment-delete"
            @click="deleteComment(comment.id)"
          >
            Hapus
          </button>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const memory = ref({})
const comments = ref([])
const commentText = ref('')
const statusError = ref('')
const isLoadingComments = ref(false)
const isSubmittingComment = ref(false)

const currentUserId = computed(() => auth.user?.id)
const canDeleteMemory = computed(() => {
  return auth.user?.role === 'admin' || memory.value.userId === currentUserId.value
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const canDeleteComment = (comment) => {
  return auth.user?.role === 'admin' || comment.userId === currentUserId.value
}

const fetchMemory = async () => {
  try {
    const res = await api.get(`/memories/${route.params.id}`)
    memory.value = res.data
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengambil detail memory.'
  }
}

const fetchComments = async () => {
  isLoadingComments.value = true

  try {
    const res = await api.get(`/comments/${route.params.id}`)
    comments.value = res.data
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengambil komentar.'
  } finally {
    isLoadingComments.value = false
  }
}

const addComment = async () => {
  statusError.value = ''

  if (!commentText.value) {
    statusError.value = 'Komentar tidak boleh kosong.'
    return
  }

  isSubmittingComment.value = true

  try {
    await api.post(`/comments/${route.params.id}`, {
      content: commentText.value,
    })

    commentText.value = ''
    await fetchComments()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal menambahkan komentar.'
  } finally {
    isSubmittingComment.value = false
  }
}

const deleteMemory = async () => {
  const confirmed = window.confirm('Yakin ingin menghapus memory ini? Tindakan ini tidak bisa dibatalkan.')
  if (!confirmed) return

  try {
    await api.delete(`/memories/${route.params.id}`)
    router.push('/memories')
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal menghapus memory.'
  }
}

const deleteComment = async (id) => {
  const confirmed = window.confirm('Yakin ingin menghapus komentar ini?')
  if (!confirmed) return

  try {
    await api.delete(`/comments/${id}`)
    await fetchComments()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal menghapus komentar.'
  }
}

const goBack = () => {
  router.push('/memories')
}

onMounted(async () => {
  await fetchMemory()
  await fetchComments()
})
</script>

<style scoped>
.detail-page {
  display: grid;
  gap: 24px;
}

.memory-panel,
.comments-panel {
  padding: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.memory-copy {
  display: grid;
  gap: 20px;
}

.memory-head {
  display: grid;
  gap: 12px;
}

.memory-badge {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.08);
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.memory-head h1 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.08;
}

.memory-head p {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.8;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
}

.comment-form {
  display: grid;
  gap: 16px;
}

.comment-form button {
  justify-self: flex-start;
}

.comment-list {
  display: grid;
  gap: 14px;
}

.comment-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 16px;
  background: var(--bg-soft);
  border: 1px solid rgba(219, 227, 239, 0.8);
}

.comment-copy {
  display: grid;
  gap: 10px;
}

.comment-copy p {
  line-height: 1.7;
}

.comment-delete {
  align-self: start;
  padding: 0;
  background: transparent;
  color: var(--danger);
  box-shadow: none;
}

.comment-delete:hover {
  transform: none;
  box-shadow: none;
  text-decoration: underline;
}

.empty-state {
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-soft);
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .memory-panel,
  .comments-panel {
    padding: 20px;
  }

  .topbar,
  .comment-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

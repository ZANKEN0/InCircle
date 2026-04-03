<template>
  <main class="page-shell memories-page">
    <section class="composer panel">
      <div class="section-heading">
        <div>
          <h2>Buat Memory Baru</h2>
          <p>Tuliskan momen, cerita, atau catatan kecil yang ingin disimpan bersama.</p>
        </div>
      </div>

      <form class="memory-form" @submit.prevent="createMemory">
        <div class="field-group">
          <label for="memory-title">Judul memory</label>
          <input id="memory-title" v-model.trim="title" type="text" placeholder="Contoh: Malam tahun baru" />
        </div>

        <div class="field-group">
          <label for="memory-content">Cerita</label>
          <textarea
            id="memory-content"
            v-model.trim="content"
            placeholder="Ceritakan momen yang ingin kamu simpan..."
          ></textarea>
        </div>

        <p v-if="statusError" class="status-message error" role="alert">{{ statusError }}</p>
        <p v-if="statusSuccess" class="status-message success">{{ statusSuccess }}</p>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Menyimpan...' : 'Tambah Memory' }}
        </button>
      </form>
    </section>

    <section class="memory-list panel">
      <div class="section-heading">
        <div>
          <h2>Semua Memories</h2>
          <p>{{ memories.length }} cerita tersimpan dan siap dibuka kembali kapan saja.</p>
        </div>
      </div>

      <div v-if="isLoading" class="empty-state">Memuat daftar memory...</div>
      <div v-else-if="memories.length === 0" class="empty-state">
        Belum ada memory. Tambahkan cerita pertama dari panel di sebelah kiri.
      </div>

      <div v-else class="cards">
        <article v-for="memory in memories" :key="memory.id" class="memory-card">
          <div class="card-copy">
            <div>
              <h3>{{ memory.title }}</h3>
              <p>{{ truncate(memory.content, 180) }}</p>
            </div>

            <div class="card-meta">
              <small>Dibuat oleh {{ memory.User?.name || 'Tanpa nama' }}</small>
              <small v-if="memory.createdAt">{{ formatDate(memory.createdAt) }}</small>
            </div>
          </div>

          <router-link :to="`/memories/${memory.id}`" class="card-link">Buka detail</router-link>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const memories = ref([])
const title = ref('')
const content = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const statusError = ref('')
const statusSuccess = ref('')

const truncate = (text, limit) => {
  if (!text) return ''
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const fetchMemories = async () => {
  isLoading.value = true

  try {
    const res = await api.get('/memories')
    memories.value = res.data
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengambil daftar memory.'
  } finally {
    isLoading.value = false
  }
}

const createMemory = async () => {
  statusError.value = ''
  statusSuccess.value = ''

  if (!title.value || !content.value) {
    statusError.value = 'Judul dan isi memory wajib diisi.'
    return
  }

  isSubmitting.value = true

  try {
    await api.post('/memories', {
      title: title.value,
      content: content.value,
    })

    title.value = ''
    content.value = ''
    statusSuccess.value = 'Memory berhasil ditambahkan.'
    await fetchMemories()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal membuat memory.'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchMemories)
</script>

<style scoped>
.memories-page {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.composer,
.memory-list {
  padding: 24px;
}

.composer {
  position: sticky;
  top: 96px;
}

.memory-form {
  display: grid;
  gap: 16px;
}

.memory-list {
  min-height: 420px;
}

.cards {
  display: grid;
  gap: 16px;
}

.memory-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px;
  align-items: end;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(219, 227, 239, 0.8);
  background: var(--bg-soft);
}

.card-copy {
  display: grid;
  gap: 14px;
}

.memory-card h3 {
  margin-bottom: 8px;
}

.memory-card p {
  color: var(--text-muted);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
}

.card-link {
  padding: 10px 14px;
  border-radius: 999px;
  color: var(--brand-dark);
  background: rgba(79, 70, 229, 0.08);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.empty-state {
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-soft);
  color: var(--text-muted);
}

@media (max-width: 960px) {
  .memories-page {
    grid-template-columns: 1fr;
  }

  .composer {
    position: static;
  }
}

@media (max-width: 640px) {
  .composer,
  .memory-list {
    padding: 20px;
  }

  .memory-card {
    grid-template-columns: 1fr;
    align-items: start;
  }
}
</style>

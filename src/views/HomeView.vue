<template>
  <main class="page-shell home-page">
    <section class="hero panel">
      <div class="hero-copy">
        <span class="eyebrow">Welcome back</span>
        <h1>{{ auth.user?.name ? `Halo, ${auth.user.name}` : 'Halo kembali' }}</h1>
        <p>
          Kelola cerita, komentar, dan galeri dalam satu ruang private yang rapi dan mudah
          dipakai.
        </p>

        <div class="hero-actions">
          <button type="button" @click="goTo('/memories')">Lihat Memories</button>
          <button type="button" class="ghost-button" @click="goTo('/gallery')">Buka Gallery</button>
        </div>
      </div>

      <div class="hero-side">
        <div class="mini-card">
          <span>Private status</span>
          <strong>Active</strong>
        </div>
        <div class="mini-card">
          <span>Total memories</span>
          <strong>{{ totalMemories }}</strong>
        </div>
        <div class="mini-card">
          <span>Kontributor</span>
          <strong>{{ contributorCount }}</strong>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      <article class="panel stat-card">
        <span class="stat-label">Memories tersimpan</span>
        <strong>{{ totalMemories }}</strong>
        <p>Semua cerita yang sudah dibagikan oleh anggota.</p>
      </article>

      <article class="panel stat-card">
        <span class="stat-label">Akses ruang</span>
        <strong>Private only</strong>
        <p>Halaman utama dilindungi login dan role admin.</p>
      </article>

      <article class="panel stat-card">
        <span class="stat-label">Akun aktif</span>
        <strong>{{ auth.user?.role === 'admin' ? 'Admin' : 'Member' }}</strong>
        <p>Gunakan profil untuk mengelola identitas dan foto akun.</p>
      </article>
    </section>

    <section class="panel recent-section">
      <div class="section-heading">
        <div>
          <h2>Memory terbaru</h2>
          <p>Ringkasan cepat untuk melihat aktivitas terbaru di circle kamu.</p>
        </div>
        <button type="button" class="ghost-button" @click="goTo('/memories')">Lihat semua</button>
      </div>

      <div v-if="isLoading" class="empty-state">Memuat data terbaru...</div>
      <div v-else-if="loadError" class="status-message error" role="alert">
        {{ loadError }}
      </div>
      <div v-else-if="recentMemories.length === 0" class="empty-state">
        Belum ada memory. Tambahkan cerita pertama di halaman memories.
      </div>
      <div v-else class="recent-list">
        <article v-for="memory in recentMemories" :key="memory.id" class="recent-card">
          <div>
            <h3>{{ memory.title }}</h3>
            <p>{{ truncate(memory.content, 120) }}</p>
          </div>
          <div class="recent-meta">
            <small>{{ memory.User?.name || 'Tanpa nama' }}</small>
            <router-link :to="`/memories/${memory.id}`">Buka detail</router-link>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(false)
const loadError = ref('')
const memories = ref([])

const totalMemories = computed(() => memories.value.length)
const contributorCount = computed(() => {
  return new Set(memories.value.map((memory) => memory.User?.id).filter(Boolean)).size
})
const recentMemories = computed(() => memories.value.slice(0, 3))

const truncate = (text, limit) => {
  if (!text) return ''
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

const fetchMemories = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const res = await api.get('/memories')
    memories.value = res.data
  } catch (error) {
    loadError.value = error.response?.data?.message || 'Gagal mengambil data untuk halaman utama.'
  } finally {
    isLoading.value = false
  }
}

const goTo = (path) => {
  router.push(path)
}

onMounted(fetchMemories)
</script>

<style scoped>
.home-page {
  display: grid;
  gap: 24px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  gap: 24px;
  padding: 32px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(129, 140, 248, 0.35), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #eef2ff 50%, #ffffff 100%);
}

.hero-copy {
  display: grid;
  gap: 16px;
}

.eyebrow {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.12);
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero h1 {
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.05;
}

.hero p {
  max-width: 580px;
  color: var(--text-muted);
  font-size: 16px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-side {
  display: grid;
  gap: 12px;
}

.mini-card {
  display: grid;
  gap: 4px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(199, 210, 254, 0.6);
}

.mini-card span,
.stat-label {
  color: var(--text-muted);
  font-size: 13px;
}

.mini-card strong,
.stat-card strong {
  font-size: 28px;
  color: var(--brand-dark);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card,
.recent-section {
  padding: 24px;
}

.stat-card {
  display: grid;
  gap: 8px;
}

.stat-card p {
  color: var(--text-muted);
}

.recent-list {
  display: grid;
  gap: 14px;
}

.recent-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: var(--bg-soft);
  border: 1px solid rgba(219, 227, 239, 0.8);
}

.recent-card h3 {
  margin-bottom: 8px;
}

.recent-card p {
  color: var(--text-muted);
}

.recent-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.recent-meta a {
  color: var(--brand);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.empty-state {
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-soft);
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .hero,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero,
  .stat-card,
  .recent-section {
    padding: 20px;
  }

  .recent-meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>

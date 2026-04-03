<template>
  <main class="page-shell gallery-page">
    <section v-if="auth.user?.role === 'admin'" class="upload-panel panel">
      <div class="section-heading">
        <div>
          <h2>Upload Foto Baru</h2>
          <p>Tambahkan foto ke galeri private agar bisa dinikmati semua anggota.</p>
        </div>
      </div>

      <form class="upload-form" @submit.prevent="uploadPhoto">
        <div class="field-group">
          <label for="photo-file">Pilih foto</label>
          <input id="photo-file" ref="fileInputRef" type="file" accept="image/*" @change="handleFileChange" />
        </div>

        <div class="field-group">
          <label for="photo-caption">Caption</label>
          <input id="photo-caption" v-model.trim="caption" type="text" placeholder="Tambahkan caption singkat" />
        </div>

        <p v-if="statusError" class="status-message error" role="alert">{{ statusError }}</p>
        <p v-if="statusSuccess" class="status-message success">{{ statusSuccess }}</p>

        <button type="submit" :disabled="isUploading">
          {{ isUploading ? 'Mengunggah...' : 'Upload Foto' }}
        </button>
      </form>
    </section>

    <section class="gallery-panel panel">
      <div class="section-heading">
        <div>
          <h2>Gallery</h2>
          <p>{{ photos.length }} foto tersimpan dalam ruang private ini.</p>
        </div>
      </div>

      <div v-if="isLoading" class="empty-state">Memuat galeri...</div>
      <div v-else-if="photos.length === 0" class="empty-state">
        Belum ada foto di galeri. Upload foto pertama untuk memulai koleksi.
      </div>

      <div v-else class="gallery-grid">
        <article v-for="photo in photos" :key="photo.id" class="photo-card">
          <button type="button" class="photo-button" @click="openPreview(photo)">
            <img :src="imageUrl(photo.image)" :alt="photo.caption || 'Foto galeri InnerCircle'" />
          </button>

          <div class="photo-meta">
            <p>{{ photo.caption || 'Tanpa caption' }}</p>
            <small v-if="photo.createdAt">{{ formatDate(photo.createdAt) }}</small>
          </div>

          <button
            v-if="auth.user?.role === 'admin'"
            type="button"
            class="delete-btn"
            @click="deletePhoto(photo.id)"
          >
            Hapus
          </button>
        </article>
      </div>
    </section>

    <div v-if="selectedPhoto" class="modal-overlay" @click.self="closePreview">
      <div class="modal panel" role="dialog" aria-modal="true">
        <button type="button" class="close-button ghost-button" @click="closePreview">Tutup</button>
        <img
          :src="imageUrl(selectedPhoto.image)"
          :alt="selectedPhoto.caption || 'Preview foto galeri'"
        />
        <p>{{ selectedPhoto.caption || 'Tanpa caption' }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import api, { UPLOAD_BASE_URL } from '../services/api'

const auth = useAuthStore()
const photos = ref([])
const caption = ref('')
const selectedFile = ref(null)
const selectedPhoto = ref(null)
const fileInputRef = ref(null)
const isLoading = ref(false)
const isUploading = ref(false)
const statusError = ref('')
const statusSuccess = ref('')

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const imageUrl = (filename) => `${UPLOAD_BASE_URL}/${filename}`

const fetchPhotos = async () => {
  isLoading.value = true

  try {
    const res = await api.get('/gallery')
    photos.value = res.data
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengambil galeri.'
  } finally {
    isLoading.value = false
  }
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files?.[0] || null
}

const uploadPhoto = async () => {
  statusError.value = ''
  statusSuccess.value = ''

  if (!selectedFile.value) {
    statusError.value = 'Pilih file foto terlebih dahulu.'
    return
  }

  const formData = new FormData()
  formData.append('photo', selectedFile.value)
  formData.append('caption', caption.value)

  isUploading.value = true

  try {
    await api.post('/gallery', formData)
    caption.value = ''
    selectedFile.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    statusSuccess.value = 'Foto berhasil diunggah.'
    await fetchPhotos()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengunggah foto.'
  } finally {
    isUploading.value = false
  }
}

const deletePhoto = async (id) => {
  const confirmed = window.confirm('Yakin ingin menghapus foto ini dari galeri?')
  if (!confirmed) return

  try {
    await api.delete(`/gallery/${id}`)
    await fetchPhotos()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal menghapus foto.'
  }
}

const openPreview = (photo) => {
  selectedPhoto.value = photo
}

const closePreview = () => {
  selectedPhoto.value = null
}

onMounted(fetchPhotos)
</script>

<style scoped>
.gallery-page {
  display: grid;
  gap: 24px;
}

.upload-panel,
.gallery-panel {
  padding: 24px;
}

.upload-form {
  display: grid;
  gap: 16px;
  max-width: 520px;
}

.upload-form button {
  justify-self: flex-start;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 18px;
}

.photo-card {
  display: grid;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(219, 227, 239, 0.8);
  background: var(--bg-soft);
}

.photo-button {
  padding: 0;
  border-radius: 14px;
  background: transparent;
  box-shadow: none;
  overflow: hidden;
}

.photo-button:hover {
  transform: none;
  box-shadow: none;
}

.photo-button img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
}

.photo-button:hover img {
  transform: scale(1.03);
}

.photo-meta {
  display: grid;
  gap: 6px;
}

.photo-meta p {
  font-weight: 600;
}

.delete-btn {
  justify-self: flex-start;
  padding: 8px 14px;
}

.empty-state {
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-soft);
  color: var(--text-muted);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1100;
}

.modal {
  width: min(720px, 100%);
  padding: 18px;
  display: grid;
  gap: 14px;
}

.modal img {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 18px;
  background: #e2e8f0;
}

.close-button {
  justify-self: flex-end;
}

@media (max-width: 640px) {
  .upload-panel,
  .gallery-panel {
    padding: 20px;
  }
}
</style>

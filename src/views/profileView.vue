<template>
  <main class="page-shell profile-page">
    <section class="profile-summary panel">
      <div class="avatar-section">
        <img
          v-if="previewImage || auth.user?.profileImage"
          :src="previewImage || imageUrl"
          class="avatar"
          :alt="`Foto profil ${auth.user?.name || 'pengguna'}`"
        />

        <div v-else class="avatar-placeholder" aria-hidden="true">
          {{ auth.user?.name?.charAt(0).toUpperCase() }}
        </div>

        <div class="user-meta">
          <h2>{{ auth.user?.name || 'User' }}</h2>
          <p>{{ auth.user?.email }}</p>
          <small>{{ auth.user?.role || 'member' }}</small>
        </div>
      </div>
    </section>

    <section class="profile-editor panel">
      <div class="section-heading">
        <div>
          <h2>Kelola Profil</h2>
          <p>Perbarui informasi akun dan foto profil agar lebih mudah dikenali.</p>
        </div>
      </div>

      <div v-if="statusError" class="status-message error" role="alert">{{ statusError }}</div>
      <div v-if="statusSuccess" class="status-message success">{{ statusSuccess }}</div>

      <form class="profile-form" @submit.prevent="updateProfile">
        <div class="field-group">
          <label for="profile-name">Nama</label>
          <input id="profile-name" v-model.trim="name" type="text" placeholder="Nama lengkap" />
        </div>

        <div class="field-group">
          <label for="profile-email">Email</label>
          <input id="profile-email" v-model.trim="email" type="email" placeholder="Email aktif" />
        </div>

        <button type="submit" :disabled="isSavingProfile">
          {{ isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>

      <hr />

      <form class="photo-form" @submit.prevent="uploadPhoto">
        <div class="field-group">
          <label for="profile-photo">Foto profil</label>
          <input id="profile-photo" ref="photoInputRef" type="file" accept="image/*" @change="handleFileChange" />
        </div>

        <button type="submit" class="ghost-button" :disabled="isUploadingPhoto">
          {{ isUploadingPhoto ? 'Mengunggah...' : 'Upload Foto' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import api, { UPLOAD_BASE_URL } from '../services/api'

const auth = useAuthStore()

const name = ref(auth.user?.name || '')
const email = ref(auth.user?.email || '')
const selectedFile = ref(null)
const previewImage = ref(null)
const photoInputRef = ref(null)
const isSavingProfile = ref(false)
const isUploadingPhoto = ref(false)
const statusError = ref('')
const statusSuccess = ref('')

const imageUrl = computed(() => {
  return auth.user?.profileImage ? `${UPLOAD_BASE_URL}/${auth.user.profileImage}` : null
})

const resetStatus = () => {
  statusError.value = ''
  statusSuccess.value = ''
}

const updateProfile = async () => {
  resetStatus()

  if (!name.value || !email.value) {
    statusError.value = 'Nama dan email wajib diisi.'
    return
  }

  isSavingProfile.value = true

  try {
    const res = await api.put('/users/profile', {
      name: name.value,
      email: email.value,
    })

    auth.user = res.data.user
    localStorage.setItem('user', JSON.stringify(auth.user))
    statusSuccess.value = 'Profil berhasil diperbarui.'
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal memperbarui profil.'
  } finally {
    isSavingProfile.value = false
  }
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0] || null
  selectedFile.value = file
  previewImage.value = file ? URL.createObjectURL(file) : null
}

const uploadPhoto = async () => {
  resetStatus()

  if (!selectedFile.value) {
    statusError.value = 'Pilih file foto terlebih dahulu.'
    return
  }

  const formData = new FormData()
  formData.append('photo', selectedFile.value)

  isUploadingPhoto.value = true

  try {
    const res = await api.put('/users/profile/photo', formData)
    auth.user = {
      ...auth.user,
      profileImage: res.data.profileImage,
    }
    localStorage.setItem('user', JSON.stringify(auth.user))

    selectedFile.value = null
    previewImage.value = null
    if (photoInputRef.value) {
      photoInputRef.value.value = ''
    }

    statusSuccess.value = 'Foto profil berhasil diperbarui.'
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengunggah foto profil.'
  } finally {
    isUploadingPhoto.value = false
  }
}
</script>

<style scoped>
.profile-page {
  display: grid;
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.profile-summary,
.profile-editor {
  padding: 24px;
}

.profile-summary {
  position: sticky;
  top: 96px;
}

.avatar-section {
  display: grid;
  justify-items: center;
  gap: 16px;
  text-align: center;
}

.avatar,
.avatar-placeholder {
  width: 140px;
  height: 140px;
  border-radius: 50%;
}

.avatar {
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--brand), #818cf8);
  color: white;
  font-size: 44px;
  font-weight: 700;
}

.user-meta {
  display: grid;
  gap: 6px;
}

.user-meta p,
.user-meta small {
  color: var(--text-muted);
}

.profile-editor {
  display: grid;
  gap: 16px;
}

.profile-form,
.photo-form {
  display: grid;
  gap: 16px;
  max-width: 520px;
}

.profile-form button,
.photo-form button {
  justify-self: flex-start;
}

@media (max-width: 900px) {
  .profile-page {
    grid-template-columns: 1fr;
  }

  .profile-summary {
    position: static;
  }
}

@media (max-width: 640px) {
  .profile-summary,
  .profile-editor {
    padding: 20px;
  }
}
</style>

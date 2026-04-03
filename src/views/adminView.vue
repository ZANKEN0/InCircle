<template>
  <main class="page-shell admin-page">
    <section class="admin-form panel">
      <div class="section-heading">
        <div>
          <h2>Tambah User Baru</h2>
          <p>Admin bisa membuat akun baru untuk anggota dan admin lainnya.</p>
        </div>
      </div>

      <form class="create-user-form" @submit.prevent="createUser">
        <div class="field-group">
          <label for="admin-name">Nama user</label>
          <input id="admin-name" v-model.trim="name" type="text" placeholder="Nama lengkap" />
        </div>

        <div class="field-group">
          <label for="admin-email">Email</label>
          <input id="admin-email" v-model.trim="email" type="email" placeholder="Email user" />
        </div>

        <div class="field-group">
          <label for="admin-password">Password</label>
          <input id="admin-password" v-model="password" type="password" placeholder="Password awal" />
        </div>

        <div class="field-group">
          <label for="admin-role">Role</label>
          <select id="admin-role" v-model="role">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <p v-if="statusError" class="status-message error" role="alert">{{ statusError }}</p>
        <p v-if="statusSuccess" class="status-message success">{{ statusSuccess }}</p>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Menyimpan...' : 'Tambah User' }}
        </button>
      </form>
    </section>

    <section class="admin-list panel">
      <div class="section-heading">
        <div>
          <h2>Daftar User</h2>
          <p>{{ users.length }} akun terdaftar di aplikasi private ini.</p>
        </div>
      </div>

      <div v-if="isLoading" class="empty-state">Memuat daftar user...</div>
      <div v-else-if="users.length === 0" class="empty-state">Belum ada user terdaftar.</div>

      <div v-else class="user-list">
        <article v-for="user in users" :key="user.id" class="user-card">
          <div class="user-copy">
            <strong>{{ user.name }}</strong>
            <p>{{ user.email }}</p>
            <small>{{ user.role }}</small>
          </div>

          <button type="button" class="danger-button" @click="deleteUser(user.id)">Hapus</button>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const users = ref([])
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('member')
const isLoading = ref(false)
const isSubmitting = ref(false)
const statusError = ref('')
const statusSuccess = ref('')

const resetStatus = () => {
  statusError.value = ''
  statusSuccess.value = ''
}

const fetchUsers = async () => {
  isLoading.value = true

  try {
    const res = await api.get('/users')
    users.value = res.data
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal mengambil daftar user.'
  } finally {
    isLoading.value = false
  }
}

const createUser = async () => {
  resetStatus()

  if (!name.value || !email.value || !password.value) {
    statusError.value = 'Nama, email, dan password wajib diisi.'
    return
  }

  isSubmitting.value = true

  try {
    await api.post('/users', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })

    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'member'
    statusSuccess.value = 'User berhasil ditambahkan.'
    await fetchUsers()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal membuat user.'
  } finally {
    isSubmitting.value = false
  }
}

const deleteUser = async (id) => {
  const confirmed = window.confirm('Yakin ingin menghapus user ini?')
  if (!confirmed) return

  resetStatus()

  try {
    await api.delete(`/users/${id}`)
    statusSuccess.value = 'User berhasil dihapus.'
    await fetchUsers()
  } catch (error) {
    statusError.value = error.response?.data?.message || 'Gagal menghapus user.'
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
.admin-page {
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.admin-form,
.admin-list {
  padding: 24px;
}

.admin-form {
  position: sticky;
  top: 96px;
}

.create-user-form {
  display: grid;
  gap: 16px;
}

.create-user-form button {
  justify-self: flex-start;
}

.user-list {
  display: grid;
  gap: 14px;
}

.user-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 16px;
  background: var(--bg-soft);
  border: 1px solid rgba(219, 227, 239, 0.8);
}

.user-copy {
  display: grid;
  gap: 6px;
}

.user-copy p {
  color: var(--text-muted);
}

.user-copy small {
  text-transform: capitalize;
}

.empty-state {
  padding: 20px;
  border-radius: 16px;
  background: var(--bg-soft);
  color: var(--text-muted);
}

@media (max-width: 960px) {
  .admin-page {
    grid-template-columns: 1fr;
  }

  .admin-form {
    position: static;
  }
}

@media (max-width: 640px) {
  .admin-form,
  .admin-list {
    padding: 20px;
  }

  .user-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

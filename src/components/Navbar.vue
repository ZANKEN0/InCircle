<template>
  <nav class="navbar">
    <div class="brand-group">
      <router-link to="/" class="logo">InnerCircle</router-link>
      <span class="tagline">Private hub for your closest circle</span>
    </div>

    <div class="nav-actions">
      <nav class="nav-links" aria-label="Menu utama">
        <router-link to="/" class="nav-link" exact-active-class="is-active">Home</router-link>
        <router-link to="/memories" class="nav-link" active-class="is-active">Memories</router-link>
        <router-link to="/gallery" class="nav-link" active-class="is-active">Gallery</router-link>
        <router-link
          v-if="auth.user?.role === 'admin'"
          to="/admin"
          class="nav-link"
          active-class="is-active"
        >
          Admin
        </router-link>
      </nav>

      <div class="profile-area" ref="menuRef">
        <button
          type="button"
          class="profile-trigger"
          @click="toggleDropdown"
          :aria-expanded="showDropdown ? 'true' : 'false'"
          aria-haspopup="menu"
        >
          <img
            v-if="auth.user?.profileImage"
            :src="imageUrl"
            class="avatar"
            :alt="`Foto profil ${auth.user?.name || 'pengguna'}`"
          />
          <div v-else class="avatar-placeholder" aria-hidden="true">
            {{ auth.user?.name?.charAt(0).toUpperCase() }}
          </div>

          <span class="profile-copy">
            <strong>{{ auth.user?.name || 'User' }}</strong>
            <small>{{ auth.user?.role || 'member' }}</small>
          </span>
        </button>

        <div v-if="showDropdown" class="dropdown" role="menu">
          <router-link to="/profile" class="dropdown-item" role="menuitem" @click="closeDropdown">
            Lihat Profil
          </router-link>
          <button type="button" class="dropdown-item logout" role="menuitem" @click="confirmLogout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div v-if="showLogoutModal" class="modal-overlay">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
      <h3 id="logout-title">Keluar dari akun?</h3>
      <p>Apakah Anda yakin ingin logout sekarang?</p>

      <div class="modal-actions">
        <button type="button" class="ghost-button" @click="showLogoutModal = false">Batal</button>
        <button type="button" class="danger-button" @click="logout">Ya, Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { UPLOAD_BASE_URL } from '../services/api'

const auth = useAuthStore()
const menuRef = ref(null)
const showDropdown = ref(false)
const showLogoutModal = ref(false)

const imageUrl = computed(() => {
  return auth.user?.profileImage ? `${UPLOAD_BASE_URL}/${auth.user.profileImage}` : null
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const confirmLogout = () => {
  closeDropdown()
  showLogoutModal.value = true
}

const logout = () => {
  auth.logout()
}

const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    closeDropdown()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
    showLogoutModal.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: min(1100px, calc(100% - 32px));
  margin: 16px auto 0;
  padding: 14px 18px;
  border: 1px solid rgba(219, 227, 239, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
}

.brand-group {
  display: grid;
  gap: 2px;
}

.logo {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--brand-dark);
}

.tagline {
  font-size: 12px;
  color: var(--text-muted);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-link {
  padding: 10px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.nav-link:hover,
.nav-link.is-active {
  background: rgba(79, 70, 229, 0.1);
  color: var(--brand-dark);
}

.profile-area {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 8px 8px;
  border-radius: 999px;
  background: #fff;
  color: var(--text-main);
  box-shadow: none;
}

.profile-trigger:hover {
  background: var(--bg-soft);
  transform: none;
  box-shadow: none;
}

.profile-copy {
  display: grid;
  text-align: left;
  line-height: 1.15;
}

.profile-copy strong {
  font-size: 14px;
}

.profile-copy small {
  text-transform: capitalize;
}

.avatar,
.avatar-placeholder {
  width: 40px;
  height: 40px;
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
  font-size: 14px;
  font-weight: 700;
}

.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 190px;
  padding: 8px;
  background: white;
  border: 1px solid rgba(219, 227, 239, 0.95);
  border-radius: 16px;
  box-shadow: 0 22px 34px rgba(15, 23, 42, 0.16);
}

.dropdown-item {
  width: 100%;
  padding: 11px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text-main);
  text-align: left;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  box-shadow: none;
}

.dropdown-item:hover {
  background: var(--bg-soft);
  box-shadow: none;
  transform: none;
}

.logout {
  color: var(--danger);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.modal {
  width: min(92vw, 360px);
  padding: 28px;
  border-radius: 22px;
  background: white;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
}

.modal p {
  margin-top: 8px;
  color: var(--text-muted);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

@media (max-width: 880px) {
  .navbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .nav-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 640px) {
  .navbar {
    width: calc(100% - 20px);
    padding: 14px;
  }

  .nav-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-links {
    width: 100%;
  }

  .profile-area {
    width: 100%;
  }

  .profile-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .dropdown {
    left: 0;
    right: 0;
  }
}
</style>

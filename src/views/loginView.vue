<template>
  <main class="login-page">
    <section class="login-layout">
      <div class="intro panel">
        <span class="eyebrow">InnerCircle Hub</span>
        <h1>Tempat private untuk menyimpan cerita, foto, dan momen penting bersama.</h1>
        <p>
          Masuk untuk melihat memories, galeri foto, dan ruang pribadi yang hanya bisa diakses
          oleh anggota terdaftar.
        </p>

        <div class="highlights">
          <div class="highlight-card">
            <strong>Private first</strong>
            <span>Seluruh halaman utama hanya bisa dibuka setelah login.</span>
          </div>
          <div class="highlight-card">
            <strong>Memories & Gallery</strong>
            <span>Simpan cerita dan foto dalam satu tempat yang rapi.</span>
          </div>
        </div>
      </div>

      <section class="form-panel panel" aria-labelledby="login-title">
        <div class="section-heading">
          <div>
            <h2 id="login-title">Masuk ke akun</h2>
            <p>Gunakan email dan password yang sudah dibuat oleh admin.</p>
          </div>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="field-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="contoh@email.com"
            />
          </div>

          <div class="field-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan password"
            />
          </div>

          <p v-if="auth.error" class="status-message error" role="alert">
            {{ auth.error }}
          </p>

          <button type="submit" :disabled="auth.isLoading || !canSubmit">
            {{ auth.isLoading ? 'Sedang masuk...' : 'Masuk' }}
          </button>
        </form>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

const canSubmit = computed(() => email.value.trim() && password.value.trim())

const handleLogin = async () => {
  if (!canSubmit.value) {
    auth.error = 'Email dan password wajib diisi.'
    return
  }

  await auth.login(email.value, password.value)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.login-layout {
  width: min(1080px, 100%);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
}

.intro,
.form-panel {
  padding: 36px;
}

.intro {
  display: grid;
  align-content: center;
  gap: 18px;
  background:
    linear-gradient(135deg, rgba(79, 70, 229, 0.98), rgba(67, 56, 202, 0.9)),
    #4f46e5;
  color: white;
}

.eyebrow {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.intro h1 {
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.08;
  color: white;
}

.intro p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
}

.highlights {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.highlight-card {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
}

.highlight-card span {
  color: rgba(255, 255, 255, 0.82);
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 16px;
}

.form-panel button {
  margin-top: 4px;
  justify-self: flex-start;
  min-width: 140px;
}

@media (max-width: 860px) {
  .login-layout {
    grid-template-columns: 1fr;
  }

  .intro,
  .form-panel {
    padding: 28px;
  }
}
</style>

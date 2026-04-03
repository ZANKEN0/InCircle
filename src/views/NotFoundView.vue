<template>
  <main class="page-shell not-found-page">
    <section class="hero panel">
      <div class="hero-copy">
        <span class="eyebrow">404</span>
        <h1>Ups. Halamannya kabur duluan sebelum kamu datang.</h1>
        <p>
          Sepertinya link ini nyasar, salah ketik, atau mungkin memorinya malu-malu tampil di
          depan umum.
        </p>

        <div class="requested-path">
          <span>Jejak yang kamu ikuti</span>
          <strong>{{ route.fullPath }}</strong>
        </div>

        <div class="mini-jokes">
          <span>Teori 1: halamannya sembunyi.</span>
          <span>Teori 2: kamu terlalu cepat buat server ini.</span>
          <span>Teori 3: link-nya lagi butuh pelukan.</span>
        </div>

        <div class="actions">
          <button type="button" @click="router.push('/')">Balik ke Home</button>
          <button type="button" class="ghost-button" @click="router.push('/memories')">
            Cek Memories
          </button>
        </div>
      </div>

      <div class="art-card">
        <div class="badge badge-top">missing page club</div>
        <div class="badge badge-mid">404 vibes only</div>
        <div class="badge badge-low">not all who wander are logged out</div>

        <div class="art-circle large"></div>
        <div class="art-circle medium"></div>
        <div class="art-circle small"></div>

        <div class="art-copy">
          <strong>Tenang, dramanya kecil.</strong>
          <p>
            Jalur aman masih tersedia. Home, memories, gallery, dan profile tetap setia menunggu.
          </p>
        </div>
      </div>
    </section>

    <section class="panel tips">
      <div class="section-heading">
        <div>
          <h2>Kalau bingung, mending ke sini dulu</h2>
          <p>Shortcut ke tempat-tempat yang paling sering dipakai di InnerCircle.</p>
        </div>
      </div>

      <div class="tip-grid">
        <article class="tip-card">
          <div class="tip-icon">Home</div>
          <h3>Markas Utama</h3>
          <p>Lihat ringkasan aplikasi dan aktivitas terbaru.</p>
          <button type="button" class="ghost-button" @click="router.push('/')">Ke Home</button>
        </article>

        <article class="tip-card">
          <div class="tip-icon">Story</div>
          <h3>Sudut Memories</h3>
          <p>Buat cerita baru atau buka momen yang sudah tersimpan.</p>
          <button type="button" class="ghost-button" @click="router.push('/memories')">
            Ke Memories
          </button>
        </article>

        <article class="tip-card">
          <div class="tip-icon">Photo</div>
          <h3>Galeri Nongkrong</h3>
          <p>Lihat foto-foto private yang sudah diunggah bareng-bareng.</p>
          <button type="button" class="ghost-button" @click="router.push('/gallery')">
            Ke Gallery
          </button>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<style scoped>
.not-found-page {
  display: grid;
  gap: 24px;
}

.hero,
.tips {
  padding: 28px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr);
  gap: 24px;
  background:
    radial-gradient(circle at top left, rgba(129, 140, 248, 0.25), transparent 28%),
    linear-gradient(135deg, #f8fbff 0%, #eef2ff 52%, #ffffff 100%);
}

.hero-copy {
  display: grid;
  gap: 18px;
  align-content: center;
}

.eyebrow {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.12);
  color: var(--brand-dark);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero h1 {
  font-size: clamp(32px, 5vw, 50px);
  line-height: 1.04;
}

.hero p {
  color: var(--text-muted);
  font-size: 16px;
  max-width: 620px;
}

.requested-path {
  display: grid;
  gap: 6px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(199, 210, 254, 0.65);
}

.requested-path span {
  font-size: 13px;
  color: var(--text-muted);
}

.requested-path strong {
  font-size: 15px;
  color: var(--brand-dark);
  word-break: break-word;
}

.mini-jokes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.mini-jokes span {
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(79, 70, 229, 0.08);
  color: var(--brand-dark);
  font-size: 13px;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.art-card {
  position: relative;
  min-height: 340px;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(160deg, #4338ca 0%, #4f46e5 52%, #818cf8 100%);
}

.badge {
  position: absolute;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.92);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}

.badge-top {
  top: 18px;
  left: 18px;
  transform: rotate(-8deg);
}

.badge-mid {
  top: 92px;
  right: 22px;
  transform: rotate(9deg);
}

.badge-low {
  bottom: 96px;
  left: 34px;
  transform: rotate(-6deg);
}

.art-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.art-circle.large {
  width: 210px;
  height: 210px;
  top: -40px;
  right: -20px;
}

.art-circle.medium {
  width: 140px;
  height: 140px;
  bottom: 56px;
  left: -24px;
}

.art-circle.small {
  width: 88px;
  height: 88px;
  top: 130px;
  left: 86px;
}

.art-copy {
  position: absolute;
  inset: auto 28px 28px 28px;
  display: grid;
  gap: 10px;
  color: white;
}

.art-copy strong {
  font-size: 24px;
}

.art-copy p {
  color: rgba(255, 255, 255, 0.85);
}

.tip-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.tip-card {
  display: grid;
  gap: 10px;
  padding: 20px;
  border-radius: 18px;
  background: var(--bg-soft);
  border: 1px solid rgba(219, 227, 239, 0.85);
}

.tip-icon {
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

.tip-card p {
  color: var(--text-muted);
}

.tip-card button {
  justify-self: flex-start;
  margin-top: 6px;
}

@media (max-width: 940px) {
  .hero,
  .tip-grid {
    grid-template-columns: 1fr;
  }

  .art-card {
    min-height: 280px;
  }
}

@media (max-width: 640px) {
  .hero,
  .tips {
    padding: 20px;
  }

  .badge-low {
    left: 18px;
    right: 18px;
    bottom: 112px;
  }
}
</style>

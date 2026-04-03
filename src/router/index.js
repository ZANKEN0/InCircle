import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/loginView.vue'
import MemoriesView from '../views/memoriesView.vue'
import MemoryDetailView from '../views/MemoryDetailView.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/adminView.vue'
import ProfileView from '../views/profileView.vue'
import GalleryView from '../views/GalleryView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      component: LoginView,
    },
    {
      path: '/memories',
      component: MemoriesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/memories/:id',
      component: MemoryDetailView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: AdminView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/gallery',
      component: GalleryView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.path === '/login' && token) {
    return '/'
  }

  if (to.path === '/admin' && user?.role !== 'admin') {
    return '/'
  }
})

export default router

<template>
  <Navbar v-if="showNavbar" />
  <router-view />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const showNavbar = computed(() => {
  return route.path !== '/login'
})
</script>

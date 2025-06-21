<template>
  <div class="app-drawer-container">
    <div v-if="isMobile && drawerOpen" class="drawer-overlay" @click="closeDrawer"></div>

    <aside
      :class="[
        'app-drawer',
        {
          'drawer-open': drawerOpen,
          'drawer-closed': !drawerOpen,
          'drawer-mobile': isMobile,
          'drawer-desktop': !isMobile,
        },
      ]"
    >
      <div class="drawer-header">
        <div class="flex items-center gap-3">
          <i class="pi pi-shield text-2xl text-red-600"></i>
          <span class="text-xl font-bold text-red-600">Validata</span>
        </div>
        <Button v-if="isMobile" icon="pi pi-times" text @click="closeDrawer" class="p-1" />
      </div>

      <nav class="drawer-nav">
        <ul class="nav-list">
          <li v-for="item in menuItems" :key="item.route" class="nav-item">
            <router-link
              :to="item.route"
              :class="['nav-link', { 'nav-link-active': $route.name === item.name }]"
              @click="handleNavClick"
            >
              <i :class="item.icon" class="nav-icon"></i>
              <span class="nav-label">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'

interface MenuItem {
  label: string
  icon: string
  route: string
  name: string
}

const drawerOpen = ref(false)
const screenWidth = ref(window.innerWidth)

const isMobile = computed(() => screenWidth.value < 768)

const menuItems: MenuItem[] = [
  {
    label: 'Produtos',
    icon: 'pi pi-box',
    route: '/app',
    name: 'app',
  },
  {
    label: 'Dashboard',
    icon: 'pi pi-chart-bar',
    route: '/dashboard',
    name: 'dashboard',
  },
]

const closeDrawer = () => {
  drawerOpen.value = false
}

const handleNavClick = () => {
  if (isMobile.value) {
    closeDrawer()
  }
}

const handleResize = () => {
  screenWidth.value = window.innerWidth
  if (!isMobile.value) {
    drawerOpen.value = true
  } else {
    drawerOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  drawerOpen.value = !isMobile.value
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  toggleDrawer: () => {
    drawerOpen.value = !drawerOpen.value
  },
  openDrawer: () => {
    drawerOpen.value = true
  },
  closeDrawer,
})
</script>

<style scoped>
.app-drawer-container {
  position: relative;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.app-drawer {
  height: 100vh;
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.drawer-desktop {
  position: relative;
  box-shadow: none;
  border-right: 1px solid #e5e7eb;
  transform: none !important;
}

.drawer-mobile {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.drawer-mobile.drawer-closed {
  transform: translateX(-100%);
}

.drawer-mobile.drawer-open {
  transform: translateX(0);
}

.drawer-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 64px;
}

.drawer-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #dc2626;
}

.nav-link-active {
  background: #fef2f2;
  color: #dc2626;
  border-right: 3px solid #dc2626;
}

.nav-icon {
  font-size: 1.25rem;
  width: 1.25rem;
  text-align: center;
}

.nav-label {
  font-weight: 500;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .drawer-overlay {
    display: none;
  }

  .drawer-mobile {
    position: relative !important;
    transform: none !important;
    box-shadow: none !important;
  }
}
</style>

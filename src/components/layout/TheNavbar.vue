<template>
  <n-layout-header bordered class="bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <n-icon size="24" class="text-primary-600 mr-2">
              <i class="fas fa-bread-slice"></i>
            </n-icon>
            <span class="text-xl font-bold text-primary-800">Validata</span>
          </div>
        </div>

        <div class="hidden md:flex md:items-center md:space-x-4">
          <n-menu mode="horizontal" :options="menuOptions" />
          <n-button
            type="primary"
            class="bg-primary-600 hover:bg-primary-700"
            @click="showAuthModal = true"
          >
            Entrar / Cadastrar
          </n-button>
        </div>

        <div class="md:hidden flex items-center">
          <n-button quaternary circle @click="mobileMenuOpen = !mobileMenuOpen">
            <template #icon>
              <n-icon size="24">
                <i class="fas fa-bars"></i>
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <n-drawer
      v-model:show="mobileMenuOpen"
      placement="right"
      :width="300"
      :trap-focus="true"
      :block-scroll="true"
    >
      <n-drawer-content title="Menu" closable>
        <n-menu :options="menuOptions" :collapsed-width="64" :collapsed-icon-size="22" />
        <div class="mt-4 px-4">
          <n-button
            type="primary"
            block
            class="bg-primary-600 hover:bg-primary-700"
            @click="handleAuthClick"
          >
            Entrar / Cadastrar
          </n-button>
        </div>
      </n-drawer-content>
    </n-drawer>

    <auth-modal v-model:show="showAuthModal" @login="handleLogin" @register="handleRegister" />
  </n-layout-header>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { NLayoutHeader, NIcon, NMenu, NButton, NDrawer, NDrawerContent } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import AuthModal from '@/components/auth/AuthModal.vue'

const mobileMenuOpen = ref(false)
const showAuthModal = ref(false)

const handleAuthClick = () => {
  showAuthModal.value = true
  mobileMenuOpen.value = false
}

const handleLogin = async (credentials: {
  email: string
  password: string
  rememberMe: boolean
}) => {
  try {
    console.log('Login attempt with:', credentials)
    // Implementar lógica de login aqui
  } catch (error) {
    console.error('Erro no login:', error)
  }
}

const handleRegister = async (data: {
  name: string
  email: string
  password: string
  businessType: string
}) => {
  try {
    console.log('Registration attempt with:', data)
    // Implementar lógica de registro aqui
  } catch (error) {
    console.error('Erro no registro:', error)
  }
}

const menuOptions: MenuOption[] = [
  {
    label: 'Recursos',
    key: 'features',
    icon: renderIcon('fas fa-star'),
  },
  {
    label: 'Como Funciona',
    key: 'how-it-works',
    icon: renderIcon('fas fa-info-circle'),
  },
]

function renderIcon(icon: string) {
  return () => h(NIcon, null, { default: () => h('i', { class: icon }) })
}
</script>

<style scoped>
.text-primary-600 {
  color: var(--primary-color-600);
}

.text-primary-800 {
  color: var(--primary-color-800);
}

.text-secondary-600 {
  color: var(--secondary-color-600);
}

.bg-primary-600 {
  background-color: var(--primary-color-600);
}

.bg-primary-700 {
  background-color: var(--primary-color-700);
}

.bg-primary-100 {
  background-color: var(--primary-color-100);
}

.hover\:bg-primary-700:hover {
  background-color: var(--primary-color-700);
}

/* Estilos para o drawer mobile */
:deep(.n-drawer-content) {
  padding: 0;
}

:deep(.n-drawer-header) {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

:deep(.n-menu) {
  padding: 8px;
}

:deep(.n-menu-item) {
  margin: 4px 0;
  border-radius: 4px;
}

:deep(.n-menu-item:hover) {
  background-color: var(--primary-color-50);
}

:deep(.n-menu-item-content) {
  padding: 12px 16px;
}

:deep(.n-menu-item-content__icon) {
  margin-right: 12px;
}
</style>

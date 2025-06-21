<template>
  <div class="min-h-screen bg-white">
    <the-navbar @show-auth="showAuthModal = true" />

    <main>
      <hero-section @show-auth="showAuthModal = true" @scroll-to="scrollTo" />

      <features-section />

      <how-it-works-section />

      <div class="bg-red-600">
        <div
          class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
        >
          <h2
            class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-center lg:text-left"
          >
            <span class="block">Pronto para reduzir o desperdício?</span>
            <span class="block text-red-200 mt-2">Comece hoje mesmo.</span>
          </h2>
          <div
            class="mt-8 flex flex-col sm:flex-row lg:mt-0 lg:flex-shrink-0 space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button
              outlined
              size="large"
              class="border-white text-white hover:bg-white hover:text-red-600"
              @click="showAuthModal = true"
            >
              Cadastre-se gratuitamente
            </Button>

            <Button
              outlined
              size="large"
              class="border-white text-white hover:bg-white hover:text-red-600"
              @click="scrollTo('#how-it-works')"
            >
              Saiba mais
            </Button>
          </div>
        </div>
      </div>

      <the-footer />
    </main>

    <auth-modal v-model:show="showAuthModal" @login="handleLogin" @register="handleRegister" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'

// Components
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
import HowItWorksSection from '@/components/home/HowItWorksSection.vue'
import AuthModal from '@/components/auth/AuthModal.vue'

const toast = useToast()
const showAuthModal = ref(false)

const scrollTo = (id: string) => {
  const element = document.querySelector(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleLogin = async (credentials: { email: string; password: string }) => {
  try {
    console.log('Login attempt:', credentials)
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso!' })
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar login' })
  }
}

const handleRegister = async (data: { name: string; email: string; password: string }) => {
  try {
    console.log('Register attempt:', data)
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Cadastro realizado com sucesso!',
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao realizar cadastro' })
  }
}
</script>

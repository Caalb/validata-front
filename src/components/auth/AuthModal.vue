<template>
  <Dialog
    :visible="show"
    @update:visible="(value: boolean) => emit('update:show', value)"
    modal
    :style="{ width: '500px' }"
    :closable="true"
    :draggable="false"
  >
    <template #header>
      <div class="text-center w-full">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 mb-4">
          <i class="pi pi-user-edit text-red-600 text-xl"></i>
        </div>

        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ isLoginView ? 'Acesse sua conta' : 'Crie sua conta' }}
        </h3>

        <p class="text-sm text-gray-500">
          {{
            isLoginView
              ? 'Entre para gerenciar seu estoque e reduzir desperdícios'
              : 'Cadastre-se para começar a reduzir o desperdício em seu negócio'
          }}
        </p>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="!isLoginView">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
        <InputText
          id="name"
          v-model="formValue.name"
          placeholder="Digite seu nome completo"
          class="w-full"
          :class="{ 'p-invalid': nameError }"
        />
        <small v-if="nameError" class="p-error">{{ nameError }}</small>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <InputText
          id="email"
          v-model="formValue.email"
          type="email"
          placeholder="Digite seu email"
          class="w-full"
          :class="{ 'p-invalid': emailError }"
        />
        <small v-if="emailError" class="p-error">{{ emailError }}</small>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <Password
          id="password"
          v-model="formValue.password"
          placeholder="Digite sua senha"
          :feedback="false"
          toggleMask
          class="w-full flex-1"
          :inputClass="{ 'p-invalid': passwordError, 'flex-1': true }"
        />
        <small v-if="passwordError" class="p-error">{{ passwordError }}</small>
      </div>

      <div v-if="isLoginView" class="flex items-center justify-between">
        <div class="flex items-center">
          <Checkbox v-model="rememberMe" inputId="remember" binary />
          <label for="remember" class="ml-2 text-sm text-gray-700">Lembrar de mim</label>
        </div>
        <Button label="Esqueceu sua senha?" link size="small" />
      </div>

      <Button
        type="submit"
        :label="isLoginView ? 'Entrar' : 'Cadastrar'"
        :loading="loading"
        class="w-full"
        size="small"
      />
    </form>

    <template #footer>
      <div class="text-center">
        <Divider>
          <span class="text-sm text-gray-500">
            {{ isLoginView ? 'Novo por aqui?' : 'Já tem uma conta?' }}
          </span>
        </Divider>

        <Button
          :label="isLoginView ? 'Criar uma conta' : 'Fazer login'"
          link
          class="w-full mt-2"
          size="small"
          @click="toggleAuthView"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import { authService } from '@/services/auth.service'
import type { AxiosError } from 'axios'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'login', credentials: { email: string; password: string; rememberMe: boolean }): void
  (e: 'register', data: RegisterData): void
}

interface RegisterData {
  name: string
  email: string
  password: string
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const router = useRouter()
const toast = useToast()
const isLoginView = ref(true)
const loading = ref(false)
const rememberMe = ref(false)

const formValue = ref({
  name: '',
  email: '',
  password: '',
})

const errors = ref({
  name: '',
  email: '',
  password: '',
})

const nameError = computed(() => errors.value.name)
const emailError = computed(() => errors.value.email)
const passwordError = computed(() => errors.value.password)

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    password: '',
  }

  let isValid = true

  if (!isLoginView.value && !formValue.value.name.trim()) {
    errors.value.name = 'Por favor, digite seu nome'
    isValid = false
  }

  if (!formValue.value.email.trim()) {
    errors.value.email = 'Por favor, digite seu email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.value.email)) {
    errors.value.email = 'Email inválido'
    isValid = false
  }

  if (!formValue.value.password.trim()) {
    errors.value.password = 'Por favor, digite sua senha'
    isValid = false
  } else if (formValue.value.password.length < 6) {
    errors.value.password = 'A senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  return isValid
}

const toggleAuthView = () => {
  isLoginView.value = !isLoginView.value
  formValue.value = {
    name: '',
    email: '',
    password: '',
  }
  errors.value = {
    name: '',
    email: '',
    password: '',
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    if (isLoginView.value) {
      const response = await authService.login({
        email: formValue.value.email,
        password: formValue.value.password,
      })

      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso!' })
      router.push('/app')
    } else {
      const response = await authService.register({
        name: formValue.value.name,
        email: formValue.value.email,
        password: formValue.value.password,
      })

      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))

      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cadastro realizado com sucesso!',
      })
      router.push('/app')
    }

    emit('update:show', false)
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: axiosError.response?.data?.message || 'Erro ao realizar operação',
    })
  } finally {
    loading.value = false
  }
}
</script>

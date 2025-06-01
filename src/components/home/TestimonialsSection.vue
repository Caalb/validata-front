<template>
  <div id="testimonials" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <n-text class="text-base font-semibold tracking-wide uppercase text-primary">
          Depoimentos
        </n-text>

        <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          O que nossos clientes dizem
        </h2>
      </div>

      <div class="mt-10">
        <n-grid :cols="24" :x-gap="24" :y-gap="24">
          <n-grid-item :span="8" v-for="testimonial in testimonials" :key="testimonial.name">
            <n-card>
              <template #header>
                <div class="flex items-center">
                  <n-avatar
                    round
                    class="mr-2"
                    :render-icon="
                      () => h(NIcon, null, { default: () => h('i', { class: testimonial.icon }) })
                    "
                  />

                  <div>
                    <n-text class="text-lg font-medium">{{ testimonial.name }}</n-text>
                    <n-text class="text-sm text-gray-500">{{ testimonial.role }}</n-text>
                  </div>
                </div>
              </template>

              <n-text class="text-gray-500">
                {{ testimonial.content }}
              </n-text>
            </n-card>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { NGrid, NGridItem, NCard, NIcon, NText, NAvatar } from 'naive-ui'

const testimonials = [
  {
    name: 'Carlos Soares',
    role: 'Proprietário - Padaria Soares',
    icon: 'fas fa-user-tie',
    content:
      'Desde que começamos a usar o sistema, reduzimos nosso desperdício em 70%. Os alertas de validade e os relatórios nos ajudam a tomar decisões melhores.',
  },
  {
    name: 'Ana Paula',
    role: 'Gerente - Mercearia do Bairro',
    icon: 'fas fa-store',
    content:
      'Os descontos automáticos aumentaram nossas vendas de produtos próximos do vencimento. Agora quase nada vai para o lixo e os clientes adoram as promoções.',
  },
  {
    name: 'João Silva',
    role: 'Cliente frequente',
    icon: 'fas fa-user',
    content:
      'Adoro as promoções de produtos que estão perto de vencer. Consigo economizar e ainda ajudo a reduzir o desperdício. Todos ganham!',
  },
]
</script>

<style scoped>
@media (max-width: 768px) {
  :deep(.n-card) {
    margin-bottom: 16px;
  }
}
</style>

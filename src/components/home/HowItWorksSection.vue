<template>
  <div id="how-it-works" class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <n-text class="text-base font-semibold tracking-wide uppercase text-primary-600">
          Como funciona
        </n-text>
        <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Transforme sua gestão em 3 passos simples
        </h2>
      </div>

      <div class="mt-10">
        <div class="relative">
          <n-grid :cols="24" :x-gap="24" :y-gap="24" class="items-center">
            <n-grid-item :span="24" :md="12" class="order-2 md:order-1">
              <n-space vertical>
                <n-card class="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <template #header>
                    <div class="flex items-center">
                      <n-icon size="24" class="text-primary-500 mr-2">
                        <i class="fas fa-1"></i>
                      </n-icon>
                      <n-text class="text-xl md:text-2xl font-bold">Cadastre seus produtos</n-text>
                    </div>
                  </template>
                  <n-text class="text-base md:text-lg text-gray-500">
                    Registre todos os produtos do seu estoque incluindo informações como data de
                    validade, quantidade e preço.
                  </n-text>
                </n-card>

                <n-card class="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <template #header>
                    <div class="flex items-center">
                      <n-icon size="24" class="text-primary-500 mr-2">
                        <i class="fas fa-2"></i>
                      </n-icon>
                      <n-text class="text-xl md:text-2xl font-bold"
                        >Receba alertas inteligentes</n-text
                      >
                    </div>
                  </template>
                  <n-text class="text-base md:text-lg text-gray-500">
                    Nosso sistema avisa quando produtos estão próximos do vencimento e sugere ações
                    como promoções ou reposição.
                  </n-text>
                </n-card>

                <n-card class="shadow-sm hover:shadow-md transition-shadow duration-200">
                  <template #header>
                    <div class="flex items-center">
                      <n-icon size="24" class="text-primary-500 mr-2">
                        <i class="fas fa-3"></i>
                      </n-icon>
                      <n-text class="text-xl md:text-2xl font-bold"
                        >Reduza o desperdício e aumente lucros</n-text
                      >
                    </div>
                  </template>
                  <n-text class="text-base md:text-lg text-gray-500">
                    Com menos produtos vencidos e mais vendas, você reduz desperdícios e aumenta sua
                    margem de lucro.
                  </n-text>
                </n-card>
              </n-space>
            </n-grid-item>

            <n-grid-item :span="24" :md="12" class="order-1 md:order-2 mb-8 md:mb-0">
              <n-image
                width="100%"
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="App interface"
                :preview-disabled="true"
                class="rounded-lg shadow-xl"
              />
            </n-grid-item>
          </n-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NCard, NIcon, NText, NSpace, NImage } from 'naive-ui'
</script>

<style scoped>
.text-primary-500 {
  color: var(--primary-color-500);
}

.text-primary-600 {
  color: var(--primary-color-600);
}

/* Estilos responsivos */
@media (max-width: 768px) {
  :deep(.n-card) {
    margin-bottom: 16px;
  }

  :deep(.n-card-header) {
    padding: 16px;
  }

  :deep(.n-card__content) {
    padding: 16px;
  }
}
</style>

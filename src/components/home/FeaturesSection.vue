<template>
  <div id="features" class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <p class="text-base font-semibold tracking-wide uppercase text-primary">Recursos</p>

        <h2 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Tudo que você precisa para reduzir o desperdício
        </h2>

        <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Nossa plataforma oferece ferramentas poderosas para otimizar sua gestão de estoque.
        </p>
      </div>

      <div class="mt-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card class="h-full shadow-sm hover:shadow-md transition-shadow duration-200 p-2">
            <template #header>
              <div class="flex items-center">
                <i class="pi pi-tags text-primary mr-2 text-xl"></i>
                <span class="text-lg md:text-xl font-medium">Controle de Validade</span>
              </div>
            </template>
            <template #content>
              <p class="text-base md:text-lg text-gray-500">
                Acompanhe automaticamente a validade dos produtos e receba alertas quando estiverem
                próximos do vencimento.
              </p>
            </template>
          </Card>

          <Card class="h-full shadow-sm hover:shadow-md transition-shadow duration-200 p-2">
            <template #header>
              <div class="flex items-center">
                <i class="pi pi-dollar text-primary mr-2 text-xl"></i>
                <span class="text-lg md:text-xl font-medium">Precificação Dinâmica</span>
              </div>
            </template>
            <template #content>
              <p class="text-base md:text-lg text-gray-500">
                Descontos automáticos baseados na proximidade da data de validade para garantir que
                os produtos sejam vendidos.
              </p>
            </template>
          </Card>

          <Card class="h-full shadow-sm hover:shadow-md transition-shadow duration-200 p-2">
            <template #header>
              <div class="flex items-center">
                <i class="pi pi-chart-line text-primary mr-2 text-xl"></i>
                <span class="text-lg md:text-xl font-medium">Relatórios Inteligentes</span>
              </div>
            </template>
            <template #content>
              <p class="text-base md:text-lg text-gray-500">
                Análises detalhadas para entender padrões de venda e otimizar suas compras junto aos
                fornecedores.
              </p>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
</script>

<style scoped>
@media (max-width: 768px) {
  :deep(.p-card) {
    margin-bottom: 16px;
  }

  :deep(.p-card-header) {
    padding: 16px;
  }

  :deep(.p-card-content) {
    padding: 16px;
  }
}
</style>

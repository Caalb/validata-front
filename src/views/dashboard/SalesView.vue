<template>
  <div class="sales-view">
    <Card class="mb-6">
      <template #header>
        <div class="p-4 pb-0">
          <h2 class="text-xl font-bold text-gray-800">Análise de Vendas</h2>
          <p class="text-gray-600 text-sm">Métricas e insights sobre suas vendas</p>
        </div>
      </template>
      <template #content>
        <div class="text-center py-12">
          <div class="mb-6">
            <i class="pi pi-chart-line text-6xl text-gray-300"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">
            Análise de Vendas em Desenvolvimento
          </h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            Esta seção apresentará gráficos e métricas detalhadas sobre o desempenho das suas
            vendas, incluindo tendências, produtos mais vendidos e análises de receita.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div class="bg-blue-50 p-4 rounded-lg">
              <i class="pi pi-dollar text-2xl text-blue-600 mb-2"></i>
              <h4 class="font-semibold text-blue-700">Receita Total</h4>
              <p class="text-blue-600 text-sm">Acompanhe sua receita em tempo real</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <i class="pi pi-trending-up text-2xl text-green-600 mb-2"></i>
              <h4 class="font-semibold text-green-700">Tendências de Vendas</h4>
              <p class="text-green-600 text-sm">Identifique padrões e oportunidades</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <i class="pi pi-star text-2xl text-purple-600 mb-2"></i>
              <h4 class="font-semibold text-purple-700">Top Produtos</h4>
              <p class="text-purple-600 text-sm">Produtos com melhor desempenho</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <template #header>
          <div class="p-4 pb-0">
            <h3 class="font-semibold text-gray-800">Vendas por Período</h3>
          </div>
        </template>
        <template #content>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <i class="pi pi-chart-bar text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Gráfico em desenvolvimento</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #header>
          <div class="p-4 pb-0">
            <h3 class="font-semibold text-gray-800">Produtos Mais Vendidos</h3>
          </div>
        </template>
        <template #content>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <i class="pi pi-chart-pie text-3xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Gráfico em desenvolvimento</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
</script>

<style scoped>
.sales-view {
  width: 100%;
}
</style>

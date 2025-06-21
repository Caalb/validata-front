<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-red-600">ValiData</h1>
      </div>
    </header>

    <main class="p-4">
      <div class="max-w-7xl mx-auto">
        <Card class="mb-8">
          <template #content>
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Gestão de Produtos</h2>
            <p class="text-gray-600">Gerencie seus produtos com controle de validade e estoque.</p>
          </template>
        </Card>

        <ProductBarcodeIntegration />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import ProductBarcodeIntegration from '@/components/products/ProductBarcodeIntegration.vue'
</script>

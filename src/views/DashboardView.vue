<template>
  <AppLayout page-title="Dashboard de Vendas">
    <Card class="mb-8">
      <template #content>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Dashboard em Desenvolvimento</h2>
        <p class="text-gray-600">Aqui será exibido o dashboard com métricas e análises de vendas.</p>
      </template>
    </Card>
  </AppLayout>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>
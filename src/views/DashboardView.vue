<template>
  <AppLayout page-title="Dashboard de Vendas">
    <!-- Expiration Analytics Section -->
    <ExpirationCharts />

    <!-- Future Metrics Section -->
    <Card class="mt-8">
      <template #content>
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Outras Métricas</h2>
        <p class="text-gray-600">Aqui serão exibidas outras métricas e análises de vendas.</p>
      </template>
    </Card>
  </AppLayout>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import AppLayout from '@/components/layout/AppLayout.vue'
import ExpirationCharts from '@/components/charts/ExpirationCharts.vue'
</script>

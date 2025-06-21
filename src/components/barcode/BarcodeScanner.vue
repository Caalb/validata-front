<template>
  <div class="barcode-scanner">
    <div v-if="isScanning" class="scanner-container">
      <div id="interactive" class="viewport"></div>
      <div class="scanner-controls">
        <Button @click="stopScanner" severity="danger" size="large" icon="pi pi-times">
          Fechar Scanner
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Quagga, { type QuaggaJSResultObject } from '@ericblade/quagga2'

const emit = defineEmits(['barcode-detected', 'close'])

const isScanning = ref(false)

const startScanner = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true })
    isScanning.value = true

    await new Promise((resolve) => setTimeout(resolve, 100))

    const targetElement = document.querySelector('#interactive') as HTMLElement
    if (!targetElement) {
      throw new Error('Elemento do scanner não encontrado')
    }

    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: targetElement,
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'code_128_reader',
            'code_39_reader',
            'upc_reader',
          ],
        },
      },
      (err: Error | null) => {
        if (err) {
          console.error('Erro ao inicializar o scanner:', err)
          isScanning.value = false
          emit('close')
          return
        }
        Quagga.start()
      },
    )

    const detectionHandler = (result: QuaggaJSResultObject) => {
      if (result.codeResult.code) {
        const format = result.codeResult.format || 'EAN_13'
        emit('barcode-detected', { code: result.codeResult.code, format })
        Quagga.stop()
        stopScanner()
      }
    }

    Quagga.onDetected(detectionHandler)
  } catch (error) {
    console.error('Erro ao acessar a câmera:', error)
    isScanning.value = false
    emit('close')
  }
}

const stopScanner = () => {
  try {
    if (Quagga.CameraAccess.getActiveStreamLabel()) {
      Quagga.stop()
    }
  } catch (error) {
    console.error('Erro ao parar o scanner:', error)
  } finally {
    isScanning.value = false
    emit('close')
  }
}

onMounted(() => {
  startScanner()
})

onUnmounted(() => {
  if (isScanning.value) {
    stopScanner()
  }
})
</script>

<style scoped>
.barcode-scanner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scanner-container {
  width: 100%;
  max-width: 800px;
  height: 80vh;
  background: transparent;
  padding: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.viewport {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.scanner-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  z-index: 2;
}
</style>

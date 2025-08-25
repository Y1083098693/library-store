<template>
  <div class="flex space-x-1 mr-4">
    <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono">
      {{ hours }}
    </div>
    <span class="flex items-center">:</span>
    <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono">
      {{ minutes }}
    </div>
    <span class="flex items-center">:</span>
    <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono">
      {{ seconds }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'CountdownTimer',
  setup() {
    const hours = ref('08')
    const minutes = ref('45')
    const seconds = ref('32')

    let interval

    const updateTimer = () => {
      let h = parseInt(hours.value)
      let m = parseInt(minutes.value)
      let s = parseInt(seconds.value)

      s--

      if (s < 0) {
        s = 59
        m--

        if (m < 0) {
          m = 59
          h--

          if (h < 0) {
            h = 0
            m = 0
            s = 0
            clearInterval(interval)
          }
        }
      }

      hours.value = h.toString().padStart(2, '0')
      minutes.value = m.toString().padStart(2, '0')
      seconds.value = s.toString().padStart(2, '0')
    }

    onMounted(() => {
      interval = setInterval(updateTimer, 1000)
    })

    onUnmounted(() => {
      clearInterval(interval)
    })

    return {
      hours,
      minutes,
      seconds,
    }
  },
}
</script>

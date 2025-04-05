<script setup>
import { defineProps } from 'vue'

defineProps({
  horses: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Horse Table'
  },
  resultMode: {
    type: Boolean,
    default: false
  },
  scheduleMode: {
    type: Boolean,
    default: false
  }
})

const getPerformanceColor = (condition) => {
  if (condition >= 85) return 'text-green-600'
  if (condition >= 70) return 'text-amber-500'
  return 'text-red-600'
}

const getPerformanceArrow = (condition) => {
  if (condition >= 85) return '↑'
  if (condition >= 70) return '→'
  return '↓'
}

const getLuckColor = (luckFactor) => {
  if (luckFactor > 1.2) return 'text-green-600'
  if (luckFactor > 0.9) return 'text-amber-500'
  return 'text-red-600'
}
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div v-if="!resultMode && !scheduleMode" class="bg-blue-100 py-2 px-4">
      <h3 class="text-lg font-bold text-center">{{ title }}</h3>
    </div>

    <div class="overflow-y-auto">
      <table class="min-w-full">
        <thead class="bg-gray-800 text-white sticky top-0">
          <tr>
            <th class="py-2 px-2 text-center w-14">Pos</th>
            <th class="py-2 px-2 text-left">Horse</th>
            <th class="py-2 px-2 text-center w-12">ID</th>
            <th class="py-2 px-2 text-center w-20">Condition</th>
            <th v-if="resultMode" class="py-2 px-2 text-center w-20">Luck</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(horse, index) in horses"
            :key="horse.id"
            class="hover:bg-gray-50 border-b"
          >
            <td class="py-2 px-2 text-center font-bold">
              {{ resultMode && horse.position ? horse.position : index + 1 }}
            </td>
            <td class="py-2 px-2 font-medium">
              {{ horse.name }}
            </td>
            <td class="py-2 px-2 text-center">
              <span class="inline-block w-6 h-6 rounded-full flex items-center justify-center"
                :class="[horse.color, horse.textColor]">
                {{ horse.id }}
              </span>
            </td>
            <td class="py-2 px-2 text-center">
              <div class="flex items-center justify-center space-x-1">
                <span>{{ horse.condition }}</span>
                <span
                  class="text-lg font-bold"
                  :class="getPerformanceColor(horse.condition)"
                >
                  {{ getPerformanceArrow(horse.condition) }}
                </span>
              </div>
            </td>
            <td v-if="resultMode && horse.luckFactor" class="py-2 px-2 text-center">
              <div class="flex items-center justify-center space-x-1">
                <span :class="getLuckColor(horse.luckFactor)" class="font-bold">
                  x{{ horse.luckFactor }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
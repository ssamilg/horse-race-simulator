<script setup>
import { ref } from 'vue'
import { HORSES } from '@/constants/horses'

const horses = ref(HORSES)

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
</script>

<template>
  <div class="horse-list bg-gray-100 rounded-lg shadow p-4 h-full">
    <h2 class="text-2xl font-bold mb-4 text-center">Horses</h2>

    <div class="h-[94%] overflow-y-auto">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-800 text-white sticky top-0">
          <tr>
            <th class="py-2 px-4 border-b border-gray-600 text-center w-16">ID</th>
            <th class="py-2 px-4 border-b border-gray-600 text-left">Name</th>
            <th class="py-2 px-4 border-b border-gray-600 text-center">Condition</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="horse in horses"
            :key="horse.id"
            class="cursor-pointer bg-opacity-20"
            :class="`${horse.color}`"
          >
            <td class="border-b border-gray-300" :class="`${horse.color}`">
              <div class="flex justify-center font-bold">
                <span :class="horse.textColor">{{ horse.id }}</span>
              </div>
            </td>
            <td class="py-3 px-4 border-b border-gray-300 font-medium">{{ horse.name }}</td>
            <td class="py-3 px-4 border-b border-gray-300 text-center">
              <div class="flex items-center justify-center space-x-2 bg-opacity-20 bg-gray-500 rounded-lg">
                <span class="font-bold">{{ horse.condition }}</span>
                <span
                  class="text-xl font-bold"
                  :class="getPerformanceColor(horse.condition)"
                >
                  {{ getPerformanceArrow(horse.condition) }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
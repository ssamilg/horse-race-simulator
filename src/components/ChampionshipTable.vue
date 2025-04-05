<script setup>
import { defineProps } from 'vue'

defineProps({
  standings: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="bg-purple-100 py-2 px-4">
      <h3 class="text-lg font-bold text-center">Championship Standings</h3>
    </div>

    <div class="overflow-y-auto">
      <table class="min-w-full">
        <thead class="bg-gray-800 text-white sticky top-0">
          <tr>
            <th class="py-2 px-2 text-center w-14">Pos</th>
            <th class="py-2 px-2 text-left">Horse</th>
            <th class="py-2 px-2 text-center w-12">ID</th>
            <th class="py-2 px-2 text-center w-20">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(horse, index) in standings"
            :key="horse.id"
            class="hover:bg-gray-50 border-b"
            :class="{ 'bg-yellow-50': index === 0, 'bg-gray-50': index === 1, 'bg-amber-50': index === 2 }"
          >
            <td class="py-2 px-2 text-center font-bold">
              {{ index + 1 }}
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
            <td class="py-2 px-2 text-center font-bold">
              {{ horse.points }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
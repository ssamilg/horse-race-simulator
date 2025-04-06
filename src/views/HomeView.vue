<script setup>
import HorseList from '@/components/HorseList.vue'
import HorseTable from '@/components/HorseTable.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import ResultsView from '@/components/ResultsView.vue'
import { useRaceStore } from '@/stores/raceStore'
import { computed } from 'vue'

const raceStore = useRaceStore()

// Dynamic start button text based on current round
const startButtonText = computed(() => {
  if (raceStore.currentRound === 0) {
    return 'START RACE'
  } else if (raceStore.currentRound === 5) {
    return 'START FINAL ROUND'
  } else {
    return `START ROUND ${raceStore.currentRound + 1}`
  }
})

// Functions
const toggleHorseList = () => {
  raceStore.toggleHorseList()
}

const generateProgram = () => {
  raceStore.generateProgram()
}

const startRace = () => {
  raceStore.toggleRacing(true) // Force racing to start
}

const handleRaceCompleted = (results) => {
  raceStore.setRaceResults(results)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4 h-screen">
    <div class="flex flex-col md:flex-row gap-6 h-full">
      <!-- Horse List Section with Toggle -->
      <div v-if="raceStore.showHorseList" class="md:w-1/3 h-full relative">
        <button
          @click="toggleHorseList"
          class="absolute -right-3 top-4 z-10 bg-gray-800 text-white p-1 rounded-full shadow-lg hover:bg-gray-700"
          title="Hide Horse List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <HorseList />
      </div>

      <!-- Toggle Button to Show Horse List when hidden -->
      <div v-else class="flex items-start">
        <button
          @click="toggleHorseList"
          class="bg-gray-800 text-white p-1 rounded-full shadow-lg hover:bg-gray-700"
          title="Show Horse List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="md:w-2/3 bg-gray-100 rounded-lg shadow p-4 h-full" :class="{'md:w-2/3': !raceStore.showHorseList}">
        <div class="flex flex-col h-full">
          <!-- Top control buttons -->
          <div class="mb-4 flex justify-between items-center">
            <div class="text-xl font-bold text-gray-700">
              {{ raceStore.currentRoundName }} ({{ raceStore.currentRaceDistance }}m)
              <span v-if="raceStore.raceCompleted" class="text-sm text-green-600 ml-2">
                All Rounds Complete!
              </span>
            </div>

            <div class="flex space-x-4">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                @click="generateProgram"
              >
                NEW PROGRAM
              </button>
              <button
                :disabled="raceStore.isRacing || raceStore.raceCompleted || !raceStore.programHorses.length"
                :class="{ 'opacity-50 cursor-not-allowed': raceStore.isRacing || raceStore.raceCompleted || !raceStore.programHorses.length }"
                class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                @click="startRace"
              >
                {{ startButtonText }}
              </button>
            </div>
          </div>

          <div class="bg-gray-200 mb-4 overflow-hidden h-full">
            <RaceTrack
              v-if="raceStore.programHorses.length > 0"
              @race-completed="handleRaceCompleted"
            />
            <div v-else class="h-full flex items-center justify-center border-2 border-gray-400">
              <p class="text-gray-500 text-xl">Generate a program to start the race</p>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-2/3 bg-gray-100 rounded-lg shadow p-4 h-full" :class="{'md:w-1/3': !raceStore.showHorseList}">
        <div class="h-full flex flex-col">
          <!-- Current Program -->
          <div class="rounded shadow h-1/2 overflow-y-auto mb-4">
            <div v-if="raceStore.programHorses.length > 0">
              <HorseTable
                :horses="raceStore.programHorses"
                title="Current Program"
              />
            </div>
            <div v-else class="flex items-center justify-center h-full bg-white">
              <p class="text-gray-500">Click "NEW PROGRAM" to start</p>
            </div>
          </div>

          <!-- Results View -->
          <div class="h-1/2">
            <ResultsView />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

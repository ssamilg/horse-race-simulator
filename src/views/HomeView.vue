<script setup>
import HorseList from '@/components/HorseList.vue'
import HorseTable from '@/components/HorseTable.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import { useRaceStore } from '@/stores/raceStore'

const raceStore = useRaceStore()

const toggleHorseList = () => {
  raceStore.toggleHorseList()
}

const generateProgram = () => {
  raceStore.generateProgram()
}

const toggleRace = () => {
  raceStore.toggleRacing()
}

const handleRaceCompleted = (results) => {
  raceStore.setRaceResults(results)
}
</script>

<template>
  <div class="container mx-auto py-8 px-4 h-screen">
    <!-- <h1 class="text-3xl font-bold text-center mb-8 bg-red-500 text-white py-4 rounded-lg">Horse Racing</h1> -->

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

      <div class="md:w-2/3 bg-gray-100 rounded-lg shadow p-4" :class="{'md:w-2/3': !raceStore.showHorseList}">
        <div class="mb-4 flex justify-end space-x-4">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            @click="generateProgram"
          >
            GENERATE PROGRAM
          </button>
          <button
            class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            @click="toggleRace"
          >
            {{ raceStore.isRacing ? 'PAUSE' : 'START' }}
          </button>
        </div>

        <div class="h-[90%] bg-gray-200 mb-4 overflow-hidden">
          <RaceTrack
            v-if="raceStore.programHorses.length > 0"
            :horses="raceStore.programHorses"
            :is-racing="raceStore.isRacing"
            :race-distance="1200"
            @race-completed="handleRaceCompleted"
          />
          <div v-else class="h-full flex items-center justify-center border-2 border-gray-400">
            <p class="text-gray-500 text-xl">Generate a program to start the race</p>
          </div>
        </div>
      </div>

      <div class="md:w-2/3 bg-gray-100 rounded-lg shadow p-4" :class="{'md:w-1/3': !raceStore.showHorseList}">
        <div class="h-full">
          <div class="rounded shadow h-1/2">
            <HorseTable
              :horses="raceStore.programHorses"
              title="Program"
            />
            <div v-if="raceStore.programHorses.length === 0" class="flex items-center justify-center h-full bg-white">
              <p class="text-gray-500">Click "GENERATE PROGRAM" to start</p>
            </div>
          </div>

          <div class="rounded shadow h-1/2">
            <HorseTable
              v-if="raceStore.resultsHorses.length > 0"
              :horses="raceStore.resultsHorses"
              title="Results"
            />
            <div v-else class="flex items-center justify-center h-full bg-white">
              <p class="text-gray-500">Race results will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

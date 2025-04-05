<script setup>
import HorseList from '@/components/HorseList.vue'
import HorseTable from '@/components/HorseTable.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import ChampionshipTable from '@/components/ChampionshipTable.vue'
import { useRaceStore } from '@/stores/raceStore'
import { ref, computed } from 'vue'

const raceStore = useRaceStore()
const selectedRoundIndex = ref(0)
const selectedProgramRound = ref(1) // Default to round 1
const activeTab = ref('results') // 'results', 'championship', or 'schedule'

// When displaying past rounds, this determines which round results to show
const selectedRound = computed(() => {
  // If we haven't completed any rounds yet or only looking at current round, return empty array
  if (raceStore.roundResults.length === 0 || selectedRoundIndex.value >= raceStore.roundResults.length) {
    return null
  }
  return raceStore.roundResults[selectedRoundIndex.value]
})

// Which results to show in the results table
const resultsToShow = computed(() => {
  if (selectedRound.value) {
    return selectedRound.value.results
  }
  return raceStore.resultsHorses
})

// Title for results table
const resultsTitle = computed(() => {
  if (selectedRound.value) {
    return `Round ${selectedRound.value.round} Results (${selectedRound.value.distance}m)`
  }
  return 'Results'
})

// Selected program round
const selectedProgram = computed(() => {
  return raceStore.getProgramForRound(selectedProgramRound.value)
})

// Functions
const toggleHorseList = () => {
  raceStore.toggleHorseList()
}

const generateProgram = () => {
  raceStore.generateProgram()
  selectedRoundIndex.value = 0
  selectedProgramRound.value = 1
}

const startRace = () => {
  raceStore.toggleRacing(true) // Force racing to start
}

const handleRaceCompleted = (results) => {
  raceStore.setRaceResults(results)
  // Set selected round to the one just completed
  selectedRoundIndex.value = raceStore.roundResults.length - 1
}

const viewPreviousRound = () => {
  if (selectedRoundIndex.value > 0) {
    selectedRoundIndex.value--
  }
}

const viewNextRound = () => {
  if (selectedRoundIndex.value < raceStore.roundResults.length - 1) {
    selectedRoundIndex.value++
  }
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

const viewPreviousProgramRound = () => {
  if (selectedProgramRound.value > 1) {
    selectedProgramRound.value--
  }
}

const viewNextProgramRound = () => {
  if (selectedProgramRound.value < 6) {
    selectedProgramRound.value++
  }
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
                class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                @click="startRace"
                :disabled="raceStore.isRacing || raceStore.raceCompleted"
                :class="{ 'opacity-50 cursor-not-allowed': raceStore.isRacing || raceStore.raceCompleted }"
              >
                START RACE
              </button>
            </div>
          </div>

          <div class="bg-gray-200 mb-4 overflow-hidden h-full">
            <RaceTrack
              v-if="raceStore.programHorses.length > 0"
              :horses="raceStore.programHorses"
              :is-racing="raceStore.isRacing"
              :race-distance="raceStore.currentRaceDistance"
              @race-completed="handleRaceCompleted"
            />
            <div v-else class="h-full flex items-center justify-center border-2 border-gray-400">
              <p class="text-gray-500 text-xl">Generate a program to start the race</p>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-2/3 bg-gray-100 rounded-lg shadow p-4" :class="{'md:w-1/3': !raceStore.showHorseList}">
        <div class="h-full">
          <div class="rounded shadow h-1/2 overflow-y-auto">
            <!-- Program Tab -->
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

          <div class="rounded shadow h-1/2">
            <!-- Tab controls -->
            <div class="flex border-b border-gray-200 h-[10%]">
              <button
                @click="setActiveTab('results')"
                :class="[
                  'py-2 px-4 text-center flex-1 font-medium text-sm focus:outline-none',
                  activeTab === 'results'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Results
              </button>
              <button
                @click="setActiveTab('championship')"
                :class="[
                  'py-2 px-4 text-center flex-1 font-medium text-sm focus:outline-none',
                  activeTab === 'championship'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Championship
              </button>
              <button
                @click="setActiveTab('schedule')"
                :class="[
                  'py-2 px-4 text-center flex-1 font-medium text-sm focus:outline-none',
                  activeTab === 'schedule'
                    ? 'border-b-2 border-green-500 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Schedule
              </button>
            </div>

            <div class="flex h-[90%] overflow-y-auto">
              <div class="basis-full">
                <!-- Results Tab -->
                <template v-if="activeTab === 'results'">
                  <!-- Results navigation controls -->
                  <div v-if="raceStore.roundResults.length > 0" class="bg-blue-100 p-2 flex justify-between items-center">
                    <button
                      @click="viewPreviousRound"
                      class="text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      :disabled="selectedRoundIndex === 0"
                      :class="{ 'opacity-50 cursor-not-allowed': selectedRoundIndex === 0 }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>

                    <span class="font-bold">
                      {{ resultsTitle }}
                    </span>

                    <button
                      @click="viewNextRound"
                      class="text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      :disabled="selectedRoundIndex === raceStore.roundResults.length - 1"
                      :class="{ 'opacity-50 cursor-not-allowed': selectedRoundIndex === raceStore.roundResults.length - 1 }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <HorseTable
                    v-if="resultsToShow.length > 0"
                    :horses="resultsToShow"
                    :title="resultsTitle"
                    :result-mode="true"
                  />
                  <div v-else class="flex items-center justify-center h-full bg-white">
                    <p class="text-gray-500">Race results will appear here</p>
                  </div>
                </template>

                <!-- Championship Tab -->
                <template v-if="activeTab === 'championship'">
                  <ChampionshipTable
                    v-if="raceStore.championshipStandings.length > 0"
                    :standings="raceStore.championshipStandings"
                  />
                  <div v-else class="flex items-center justify-center h-full bg-white">
                    <p class="text-gray-500">Championship standings will appear after races</p>
                  </div>
                </template>

                <!-- Schedule Tab -->
                <template v-if="activeTab === 'schedule'">
                  <!-- Schedule navigation controls -->
                  <div v-if="raceStore.roundPrograms.length > 0" class="bg-green-100 p-2 flex justify-between items-center">
                    <button
                      @click="viewPreviousProgramRound"
                      class="text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      :disabled="selectedProgramRound === 1"
                      :class="{ 'opacity-50 cursor-not-allowed': selectedProgramRound === 1 }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>

                    <span class="font-bold">
                      Round {{ selectedProgramRound }} Schedule ({{ selectedProgram?.distance }}m)
                    </span>

                    <button
                      @click="viewNextProgramRound"
                      class="text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      :disabled="selectedProgramRound === 6"
                      :class="{ 'opacity-50 cursor-not-allowed': selectedProgramRound === 6 }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <HorseTable
                    v-if="selectedProgram"
                    :horses="selectedProgram.horses"
                    :title="`Round ${selectedProgramRound} (${selectedProgram.distance}m)`"
                    :schedule-mode="true"
                  />
                  <div v-else class="flex items-center justify-center h-full bg-white">
                    <p class="text-gray-500">Generate a program to see the schedule</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

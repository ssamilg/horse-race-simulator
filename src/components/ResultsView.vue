<script setup>
import HorseTable from '@/components/HorseTable.vue'
import ChampionshipTable from '@/components/ChampionshipTable.vue'
import { ref, computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'

const raceStore = useRaceStore()
const selectedProgramRound = ref(1) // Default to round 1

// Use the store's active tab instead of local state
const activeTab = computed({
  get: () => raceStore.activeTab,
  set: (value) => raceStore.activeTab = value
})

// Use the store's selected round index instead of local state
const selectedRoundIndex = computed({
  get: () => raceStore.selectedRoundIndex,
  set: (value) => raceStore.selectedRoundIndex = value
})

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
const setActiveTab = (tab) => {
  activeTab.value = tab
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
  <div class="rounded shadow h-full">
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
</template>
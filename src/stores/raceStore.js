import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { HORSES } from '@/constants/horses'

export const useRaceStore = defineStore('race', () => {
  // UI State
  const showHorseList = ref(true)
  const isRacing = ref(false)

  // Race State
  const programHorses = ref([])
  const resultsHorses = ref([])
  const currentRaceDistance = ref(1200)
  const raceCompleted = ref(false)

  // Track size calculations
  const trackWidthPercent = computed(() => showHorseList.value ? 66.67 : 100) // 2/3 or full width

  // Actions
  function toggleHorseList() {
    showHorseList.value = !showHorseList.value
  }

  function toggleRacing() {
    isRacing.value = !isRacing.value
  }

  function generateProgram() {
    // Select 10 random horses for the race
    const shuffled = [...HORSES].sort(() => 0.5 - Math.random())
    programHorses.value = shuffled.slice(0, 10)

    // Reset results
    resultsHorses.value = []
    raceCompleted.value = false
    isRacing.value = false
  }

  function setRaceResults(results) {
    resultsHorses.value = results
    raceCompleted.value = true
    isRacing.value = false
  }

  return {
    // State
    showHorseList,
    isRacing,
    programHorses,
    resultsHorses,
    currentRaceDistance,
    raceCompleted,
    trackWidthPercent,

    // Actions
    toggleHorseList,
    toggleRacing,
    generateProgram,
    setRaceResults
  }
})
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { HORSES } from '@/constants/horses'

// Define race distances for each round
const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]

export const useRaceStore = defineStore('race', () => {
  // UI State
  const showHorseList = ref(true)
  const isRacing = ref(false)

  // Race State
  const programHorses = ref([])
  const resultsHorses = ref([])
  const currentRound = ref(0)
  const roundResults = ref([])
  const roundPrograms = ref([]) // Store program info for all rounds
  const raceCompleted = ref(false)

  // Championship standings (across all rounds)
  const championshipStandings = computed(() => {
    if (roundResults.value.length === 0) return []

    // Create a map to track points for each horse
    const pointsMap = new Map()

    // Points system: 1st = 10 points, 2nd = 7 points, 3rd = 5 points,
    // 4th = 3 points, 5th = 1 point
    const pointsSystem = [10, 7, 5, 3, 1]

    // Calculate points for each horse across all rounds
    roundResults.value.forEach(round => {
      round.results.forEach((horse, index) => {
        if (index < pointsSystem.length) {
          const points = pointsMap.get(horse.id) || 0
          pointsMap.set(horse.id, points + pointsSystem[index])
        }
      })
    })

    // Convert to array and sort by points
    const standings = []
    HORSES.forEach(horse => {
      const points = pointsMap.get(horse.id) || 0
      if (points > 0) {
        standings.push({
          ...horse,
          points
        })
      }
    })

    return standings.sort((a, b) => b.points - a.points)
  })

  // Current race settings
  const currentRaceDistance = computed(() => {
    return RACE_DISTANCES[currentRound.value] || 1200
  })

  // Track size calculations
  const trackWidthPercent = computed(() => showHorseList.value ? 66.67 : 100) // 2/3 or full width

  // Computed property for round name
  const currentRoundName = computed(() => {
    return `Round ${currentRound.value + 1}`
  })

  // Actions
  function toggleHorseList() {
    showHorseList.value = !showHorseList.value
  }

  function toggleRacing(forceStart = false) {
    // If forcing to start, only start if not already racing
    if (forceStart) {
      if (!isRacing.value && !raceCompleted.value) {
        isRacing.value = true
      }
    } else {
      isRacing.value = !isRacing.value
    }
  }

  function generateProgram() {
    // Reset program and results
    programHorses.value = []
    resultsHorses.value = []
    roundResults.value = []
    roundPrograms.value = []
    currentRound.value = 0
    raceCompleted.value = false
    isRacing.value = false

    // Generate programs for all 6 rounds
    for (let i = 0; i < RACE_DISTANCES.length; i++) {
      const shuffled = [...HORSES].sort(() => 0.5 - Math.random())
      const horses = shuffled.slice(0, 10)

      roundPrograms.value.push({
        round: i + 1,
        distance: RACE_DISTANCES[i],
        horses: [...horses]
      })
    }

    // Set the current program horses to the first round
    programHorses.value = [...roundPrograms.value[0].horses]
  }

  function generateRoundHorses() {
    // Set the program horses for the current round if available
    if (roundPrograms.value[currentRound.value]) {
      programHorses.value = [...roundPrograms.value[currentRound.value].horses]
    } else {
      // This should not happen with pre-generated programs, but as a fallback
      const shuffled = [...HORSES].sort(() => 0.5 - Math.random())
      programHorses.value = shuffled.slice(0, 10)
    }
  }

  function setRaceResults(results) {
    // Store the results for the current round
    resultsHorses.value = results

    // Add results to the round results array
    roundResults.value.push({
      round: currentRound.value + 1,
      distance: currentRaceDistance.value,
      results: [...results]
    })

    // Advance to the next round
    advanceToNextRound()
  }

  function advanceToNextRound() {
    // Stop the current race
    isRacing.value = false

    // Move to the next round if not at the end
    if (currentRound.value < RACE_DISTANCES.length - 1) {
      currentRound.value++
      resultsHorses.value = []
      raceCompleted.value = false

      // Use the pre-generated horses for the next round
      generateRoundHorses()
    } else {
      // All rounds completed
      raceCompleted.value = true
    }
  }

  // Get program horses for a specific round
  function getProgramForRound(roundNumber) {
    const roundIndex = roundNumber - 1
    if (roundIndex >= 0 && roundIndex < roundPrograms.value.length) {
      return roundPrograms.value[roundIndex]
    }
    return null
  }

  return {
    // State
    showHorseList,
    isRacing,
    programHorses,
    resultsHorses,
    currentRound,
    roundResults,
    roundPrograms,
    currentRaceDistance,
    raceCompleted,
    trackWidthPercent,
    currentRoundName,
    championshipStandings,

    // Actions
    toggleHorseList,
    toggleRacing,
    generateProgram,
    setRaceResults,
    advanceToNextRound,
    getProgramForRound
  }
})
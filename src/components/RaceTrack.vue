<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRaceStore } from '@/stores/raceStore'

const props = defineProps({
  horses: {
    type: Array,
    required: true
  },
  isRacing: {
    type: Boolean,
    default: false
  },
  raceDistance: {
    type: Number,
    default: 1200 // meters
  }
})

const raceStore = useRaceStore()
const trackWidth = ref(0)
const trackHeight = ref(0)
const trackElement = ref(null)
const raceCompleted = ref(false)
const horsePositions = ref({}) // Store position data by horse ID
const horseLuckFactors = ref({}) // Store luck factors for each horse

// Calculate lane height based on track height and number of horses
const laneHeight = computed(() => {
  if (!trackHeight.value || props.horses.length === 0) return 40
  // Subtract some padding to ensure lanes fit within track
  return Math.floor(trackHeight.value / props.horses.length)
})

// Calculate finish line position from the left edge based on track width
const finishLinePosition = computed(() => {
  return trackWidth.value - 20 // 20px from the right edge
})

// Generate a random luck factor between 0.7 and 1.5
const generateLuckFactor = () => {
  return 0.7 + Math.random() * 0.8 // Range: 0.7 to 1.5
}

// Initialize positions for all horses
const initializePositions = () => {
  const positions = {}
  const luckFactors = {}

  props.horses.forEach((horse, index) => {
    positions[horse.id] = {
      distance: 0,
      position: 0,
      laneNumber: index + 1
    }
    luckFactors[horse.id] = generateLuckFactor()
  })

  horsePositions.value = positions
  horseLuckFactors.value = luckFactors
  raceCompleted.value = false
}

// Watch for changes in the racing state
watch(() => props.isRacing, (newValue) => {
  if (newValue) {
    startRace()
  } else {
    pauseRace()
  }
})

// Watch for changes in horses array
watch(() => props.horses, () => {
  initializePositions()
}, { deep: true })

// Watch for horse list toggle to update track dimensions
watch(() => raceStore.showHorseList, () => {
  // When horse list visibility changes, update dimensions with a small delay
  // to allow the DOM to update first
  setTimeout(updateTrackDimensions, 100)
})

// Watch for changes in race distance to reset track
watch(() => props.raceDistance, () => {
  // When race distance changes, we need to reset the track
  initializePositions()
  finishedHorseOrder.length = 0
  raceCompleted.value = false
})

// Calculate lane position for a horse
const getLanePosition = (laneNumber) => {
  return (laneNumber - 1) * laneHeight.value
}

// Calculate vertical center position for a horse in its lane
const getHorseVerticalPosition = (laneNumber) => {
  // Position horse in the middle of its lane
  return getLanePosition(laneNumber) + (laneHeight.value / 2) - 10 // 10 is half the horse height
}

// Initialize track dimensions
onMounted(() => {
  updateTrackDimensions()
  window.addEventListener('resize', updateTrackDimensions)
  initializePositions()
})

// Clean up event listeners
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTrackDimensions)
  if (raceInterval) {
    clearInterval(raceInterval)
    raceInterval = null
  }
})

const updateTrackDimensions = () => {
  if (trackElement.value) {
    const newWidth = trackElement.value.clientWidth
    const newHeight = trackElement.value.clientHeight

    trackWidth.value = newWidth
    trackHeight.value = newHeight

    // Update all horse positions with new dimensions
    updateAllHorsePositions()
  }
}

// Update all horse positions after dimensions change
const updateAllHorsePositions = () => {
  Object.keys(horsePositions.value).forEach(horseId => {
    updateHorsePosition(horseId)
  })
}

// Race animation variables
let raceInterval = null
const finishedHorseOrder = []

const startRace = () => {
  if (raceInterval) return

  // Reset the finished horse order when starting a new race
  finishedHorseOrder.length = 0

  // Start animation loop - update every second
  raceInterval = setInterval(updateRacePositions, 1000)
}

const pauseRace = () => {
  if (raceInterval) {
    clearInterval(raceInterval)
    raceInterval = null
  }
}

const updateRacePositions = () => {
  // Calculate new positions for each horse
  let allFinished = true

  // Update each horse's position based on condition and luck factor
  props.horses.forEach(horse => {
    const position = horsePositions.value[horse.id]
    if (!position) return

    // Skip if already finished
    if (position.distance >= props.raceDistance) {
      return
    }

    // Calculate distance moved per second based on condition and luck factor
    // If condition is 100 and luck factor is 1.5, horse moves 150m per second
    const luckFactor = horseLuckFactors.value[horse.id]
    const metersPerSecond = horse.condition * luckFactor

    // Update distance
    position.distance += metersPerSecond

    // Check if finished
    if (position.distance >= props.raceDistance) {
      position.distance = props.raceDistance

      // Record the finish order
      finishedHorseOrder.push(horse.id)
    } else {
      allFinished = false
    }

    // Update positions of horses in the DOM
    updateHorsePosition(horse.id)
  })

  // Update ranking positions based on:
  // 1. First by finish order for those who've finished
  // 2. Then by current distance for those still racing

  // First assign positions to finished horses by their finish order
  finishedHorseOrder.forEach((id, index) => {
    if (horsePositions.value[id]) {
      horsePositions.value[id].position = index + 1
    }
  })

  // Then sort unfinished horses by distance
  const unfinishedHorseIds = Object.keys(horsePositions.value)
    .filter(id => !finishedHorseOrder.includes(id))
    .sort((a, b) => {
      return horsePositions.value[b].distance - horsePositions.value[a].distance
    })

  // Assign positions to unfinished horses
  unfinishedHorseIds.forEach((id, index) => {
    horsePositions.value[id].position = finishedHorseOrder.length + index + 1
  })

  // If all horses have finished, complete the race
  if (allFinished) {
    raceCompleted.value = true
    pauseRace()

    // Create results with all necessary data and correct finish order
    const results = finishedHorseOrder
      .map((id, index) => {
        // Find the original horse object
        const horse = props.horses.find(h => h.id.toString() === id.toString())
        if (!horse) return null

        return {
          ...horse,
          position: index + 1, // Position is based on finish order
          luckFactor: parseFloat(horseLuckFactors.value[id].toFixed(2))
        }
      })
      .filter(horse => horse !== null)

    emit('raceCompleted', results)
  }
}

// Update the position of a single horse in the DOM
const updateHorsePosition = (horseId) => {
  const position = horsePositions.value[horseId]
  if (!position) return

  const horseElement = document.getElementById(`horse-${horseId}`)
  if (!horseElement) return

  // Calculate position percentage
  const progressPercent = Math.min(100, (position.distance / props.raceDistance) * 100)

  // Calculate left position based on progress percentage and track width
  const leftPosition = (progressPercent / 100) * finishLinePosition.value

  // Update the element's style
  horseElement.style.left = `${leftPosition}px`
}

const emit = defineEmits(['raceCompleted'])

// Get lap distance text
const getLapDistanceText = () => {
  return `Race Distance: ${props.raceDistance}m`
}

// Format luck factor for display
// const formatLuckFactor = (luckFactor) => {
//   return luckFactor.toFixed(2)
// }
</script>

<template>
  <div class="race-track-container relative bg-gradient-to-r from-green-800 to-green-700 rounded-lg overflow-hidden border-4 border-gray-800 h-full">
    <div class="flex flex-col h-full">
      <!-- Track information -->
      <div class="flex justify-between items-center bg-gray-800 text-white px-4 py-1 z-10">
        <div>{{ getLapDistanceText() }}</div>
        <div v-if="raceCompleted" class="font-bold text-yellow-400">FINISHED</div>
      </div>

      <!-- Track lanes -->
      <div
        ref="trackElement"
        class="h-[25rem] race-track relative w-full md:h-full overflow-hidden"
      >
        <!-- Lane markers -->
        <div class="absolute left-0 bottom-0 top-0 w-1 bg-white z-10"></div>
        <div class="absolute right-0 bottom-0 top-0 w-1 bg-white z-10"></div>

        <!-- Lane lines -->
        <div
          v-for="horse in props.horses"
          :key="'lane-' + horse.id"
          class="absolute left-0 right-0 h-[1px] bg-white opacity-30"
          :style="{top: `${getLanePosition(horsePositions[horse.id]?.laneNumber)}px`}"
        ></div>

        <!-- Start line -->
        <div class="absolute left-12 top-0 bottom-0 w-[2px] bg-white z-10 dashed-line"></div>

        <!-- Finish line -->
        <div
          class="absolute top-0 bottom-0 w-[3px] bg-red-600 z-10"
          :style="{left: `${finishLinePosition}px`}"
        >
          <div class="h-full w-full bg-red-600 relative">
            <div class="absolute top-0 bottom-0 left-0 right-0 dashed-line-red"></div>
            <div class="absolute -left-28 top-1/2 transform -translate-y-1/2 text-white text-3xl font-bold opacity-50">
              FINISH
            </div>
          </div>
        </div>

        <!-- Position indicators -->
        <div
          v-for="horse in props.horses"
          :key="'pos-' + horse.id"
          class="absolute left-0 text-2xl w-12 text-white text-center text-bold opacity-50"
          :style="{top: `${getHorseVerticalPosition(horsePositions[horse.id]?.laneNumber)}px`}"
        >
          {{ horsePositions[horse.id]?.laneNumber }}
        </div>

        <!-- Horses -->
        <div
          v-for="horse in props.horses"
          :key="horse.id"
          :id="`horse-${horse.id}`"
          class="absolute transition-all"
          :style="{
            top: `${getHorseVerticalPosition(horsePositions[horse.id]?.laneNumber)}px`,
            left: '4px',
            transition: 'left 1s linear'
          }"
        >
          <!-- Horse silhouette -->
          <div class="relative">
            <!-- Horse color indicator -->
            <div
              class="absolute left-12 top-0 w-8 h-8 rounded-full border-2 border-white"
              :class="horse.color"
            >
              <span class="absolute inset-0 flex items-center justify-center text-xs font-bold" :class="horse.textColor">
                {{ horse.id }}
              </span>
            </div>

            <!-- Luck factor indicator -->
            <!-- <div
              v-if="horseLuckFactors[horse.id]"
              class="absolute left-10 top-1 text-xs px-1 py-0.5 rounded bg-white text-black font-bold"
              :class="{
                'bg-green-300': horseLuckFactors[horse.id] > 1.2,
                'bg-yellow-300': horseLuckFactors[horse.id] > 0.9 && horseLuckFactors[horse.id] <= 1.2,
                'bg-red-300': horseLuckFactors[horse.id] <= 0.9
              }"
            >
              x{{ formatLuckFactor(horseLuckFactors[horse.id]) }}
            </div> -->

            <!-- Horse silhouette -->
             <img src="@/assets/horse.png" alt="" class="w-10 h-10">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashed-line {
  background: repeating-linear-gradient(
    to bottom,
    white,
    white 10px,
    transparent 10px,
    transparent 20px
  );
}

.dashed-line-red {
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.8) 10px,
    rgba(255, 20, 20, 0.8) 10px,
    rgba(255, 20, 20, 0.8) 20px
  );
}
</style>
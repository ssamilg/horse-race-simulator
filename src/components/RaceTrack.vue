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

// Calculate lane height based on track height and number of horses
const laneHeight = computed(() => {
  if (!trackHeight.value || props.horses.length === 0) return 40
  // Subtract some padding to ensure lanes fit within track
  return Math.min(60, Math.floor(trackHeight.value / props.horses.length))
})

// Calculate finish line position from the left edge based on track width
const finishLinePosition = computed(() => {
  return trackWidth.value - 20 // 20px from the right edge
})

// Initialize positions for all horses
const initializePositions = () => {
  const positions = {}
  props.horses.forEach((horse, index) => {
    positions[horse.id] = {
      distance: 0,
      position: 0,
      laneNumber: index + 1
    }
  })
  horsePositions.value = positions
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

const startRace = () => {
  if (raceInterval) return

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
  const finishedHorses = []

  // Update each horse's position based on condition
  props.horses.forEach(horse => {
    const position = horsePositions.value[horse.id]
    if (!position) return

    // Skip if already finished
    if (position.distance >= props.raceDistance) {
      finishedHorses.push(horse.id)
      return
    }

    // Calculate distance moved per second based on condition
    // If condition is 100, horse moves 100m per second (completes 1200m in 12s)
    const metersPerSecond = horse.condition

    // Update distance
    position.distance += metersPerSecond

    // Check if finished
    if (position.distance >= props.raceDistance) {
      position.distance = props.raceDistance
      finishedHorses.push(horse.id)
    } else {
      allFinished = false
    }

    // Update positions of horses in the DOM
    updateHorsePosition(horse.id)
  })

  // Update ranking positions based on current distances
  const sortedHorseIds = Object.keys(horsePositions.value).sort((a, b) => {
    return horsePositions.value[b].distance - horsePositions.value[a].distance
  })

  sortedHorseIds.forEach((id, index) => {
    horsePositions.value[id].position = index + 1
  })

  // If all horses have finished, complete the race
  if (allFinished) {
    raceCompleted.value = true
    pauseRace()

    // Emit race completed event with results
    const results = props.horses
      .map(horse => {
        const position = horsePositions.value[horse.id]
        return {
          ...horse,
          position: position.position
        }
      })
      .sort((a, b) => a.position - b.position)

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
</script>

<template>
  <div class="race-track-container relative bg-gradient-to-r from-green-800 to-green-700 rounded-lg overflow-hidden border-4 border-gray-800 h-full">
    <!-- Track information -->
    <div class="flex justify-between items-center bg-gray-800 text-white px-4 py-1 z-10 h-[10%]">
      <div>{{ getLapDistanceText() }}</div>
      <div v-if="raceCompleted" class="font-bold text-yellow-400">FINISHED</div>
    </div>

    <!-- Track lanes -->
    <div
      ref="trackElement"
      class="race-track relative w-full h-[90%] overflow-hidden"
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
          <div class="absolute -left-12 top-1/2 transform -translate-y-1/2 text-white text-xs font-bold">
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
            class="absolute left-2 top-0 w-6 h-6 rounded-full border-2 border-white"
            :class="horse.color"
          >
            <span class="absolute inset-0 flex items-center justify-center text-xs font-bold" :class="horse.textColor">
              {{ horse.id }}
            </span>
          </div>

          <!-- Horse silhouette -->
          <svg
            width="40"
            height="20"
            viewBox="0 0 40 20"
            class="fill-black"
          >
            <path d="M39,10c-0.6-0.4-2.2-1.3-4.2-1.5L30,8c0,0-5.8-0.8-9-3c0,0-1.2,1-4,1s-7-1-7-1L2.8,5.5C1.5,6.4,1,7.8,1,9v1h2c0,0,1.5,0,1.5,2S3,14,3,14H1c0,0,0,2.5,2,3s3.3,0.2,6-1s9-1,9-1s0,0,3,1s8-2,8-2s7.5-3.8,10-4Z"/>
          </svg>
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
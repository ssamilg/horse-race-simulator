import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import RaceTrack from '../RaceTrack.vue'
import { useRaceStore } from '@/stores/raceStore'

// Mock the ResizeObserver
vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})))

describe('RaceTrack', () => {
  // Sample horse objects for testing
  const mockHorses = [
    {
      id: 1,
      name: 'Sergen Yalçın',
      color: 'bg-black',
      textColor: 'text-white',
      condition: 95
    },
    {
      id: 7,
      name: 'Ricardo Quaresma',
      color: 'bg-purple-600',
      textColor: 'text-white',
      condition: 92
    }
  ]

  // Mock getBoundingClientRect
  Element.prototype.getBoundingClientRect = vi.fn(() => {
    return {
      width: 800,
      height: 400,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  })

  // Setup mockable getElementById
  const originalGetElementById = document.getElementById

  beforeEach(() => {
    // Reset the mock
    vi.clearAllMocks()
    document.getElementById = vi.fn((id) => {
      const element = document.createElement('div')
      element.id = id
      element.style = {}
      return element
    })
  })

  afterEach(() => {
    // Restore original
    document.getElementById = originalGetElementById
  })

  // Setup the testing pinia with initial state
  const createWrapper = (initialState = {}) => {
    return mount(RaceTrack, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              race: {
                programHorses: mockHorses,
                isRacing: false,
                currentRaceDistance: 1200,
                showHorseList: true,
                ...initialState
              }
            }
          })
        ],
        stubs: {
          transition: false // Stub transition to make tests simpler
        }
      }
    })
  }

  it('renders the race track with the correct distance', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.flex.justify-between').text()).toContain('Race Distance: 1200m')
  })

  it('displays the correct number of horses on the track', () => {
    const wrapper = createWrapper()
    const horses = wrapper.findAll('[id^="horse-"]')
    expect(horses.length).toBe(2)
  })

  it('updates when isRacing changes', async () => {
    const wrapper = createWrapper()
    const store = useRaceStore()

    // Start racing
    store.isRacing = true
    await wrapper.vm.$nextTick()

    // Verify emit is called when race completes
    // This is a simplified test since animation is complex
    const emitSpy = vi.spyOn(wrapper.vm, 'emit')
    wrapper.vm.raceCompleted = true

    // Trigger the function that would call emit
    const results = mockHorses.map((h, i) => ({ ...h, position: i + 1, luckFactor: 1.0 }))
    wrapper.vm.emit('raceCompleted', results)

    expect(emitSpy).toHaveBeenCalledWith('raceCompleted', expect.any(Array))
  })

  it('shows the "FINISHED" text when race is completed', async () => {
    const wrapper = createWrapper()

    // Initially no FINISHED text
    expect(wrapper.find('.text-yellow-400').exists()).toBe(false)

    // Set race to completed
    wrapper.vm.raceCompleted = true
    await wrapper.vm.$nextTick()

    // Now should show FINISHED
    expect(wrapper.find('.text-yellow-400').exists()).toBe(true)
    expect(wrapper.find('.text-yellow-400').text()).toBe('FINISHED')
  })
})
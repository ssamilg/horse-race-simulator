import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ResultsView from '../ResultsView.vue'
import { useRaceStore } from '@/stores/raceStore'

describe('ResultsView', () => {
  // Sample horse objects for testing
  const horse1 = {
    id: 1,
    name: 'Sergen Yalçın',
    color: 'bg-black',
    textColor: 'text-white',
    condition: 95
  }

  const horse2 = {
    id: 7,
    name: 'Ricardo Quaresma',
    color: 'bg-purple-600',
    textColor: 'text-white',
    condition: 92
  }

  // Setup the testing pinia with initial state
  const createWrapper = (initialState = {}) => {
    return mount(ResultsView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              race: {
                activeTab: 'results',
                selectedRoundIndex: 0,
                roundResults: [],
                championshipStandings: [],
                roundPrograms: [],
                resultsHorses: [],
                ...initialState
              }
            }
          })
        ]
      }
    })
  }

  it('renders with the results tab active by default', () => {
    const wrapper = createWrapper()
    const tabs = wrapper.findAll('button')

    // Check the first tab (Results) has the active class
    expect(tabs[0].classes()).toContain('border-blue-500')
    expect(tabs[0].classes()).toContain('text-blue-600')
  })

  it('shows correct tab based on activeTab state', () => {
    // Initialize with championship tab active
    const wrapper = createWrapper({ activeTab: 'championship' })

    // Check Championship tab has the active class
    const tabs = wrapper.findAll('button')
    expect(tabs[1].classes()).toContain('border-purple-500')
    expect(tabs[1].classes()).toContain('text-purple-600')
  })

  it('displays "no results" message when no round results are available', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Race results will appear here')
  })

  it('displays round results when available', () => {
    const mockRoundResults = [
      {
        round: 1,
        distance: 1200,
        results: [
          { ...horse1, position: 1, luckFactor: 1.2 },
          { ...horse2, position: 2, luckFactor: 0.9 }
        ]
      }
    ]

    const wrapper = createWrapper({
      roundResults: mockRoundResults,
      resultsHorses: mockRoundResults[0].results
    })

    // Check the title contains the round info
    expect(wrapper.find('.font-bold').text()).toContain('Round 1 Results (1200m)')

    // Check horse info is displayed in the table
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
    expect(rows[0].text()).toContain('Sergen Yalçın')
    expect(rows[1].text()).toContain('Ricardo Quaresma')
  })

  it('can switch between tabs', async () => {
    const wrapper = createWrapper()
    const tabs = wrapper.findAll('button')

    // Click on Championship tab
    await tabs[1].trigger('click')

    // Verify store action was called
    const store = useRaceStore()
    expect(store.activeTab).toBe('championship')
  })

  it('shows navigation buttons when there are multiple round results', () => {
    const mockRoundResults = [
      {
        round: 1,
        distance: 1200,
        results: [{ ...horse1, position: 1 }]
      },
      {
        round: 2,
        distance: 1400,
        results: [{ ...horse2, position: 1 }]
      }
    ]

    const wrapper = createWrapper({
      roundResults: mockRoundResults,
      resultsHorses: mockRoundResults[0].results
    })

    // There should be two nav buttons (previous and next)
    const navButtons = wrapper.findAll('.text-blue-700')
    expect(navButtons.length).toBe(2)

    // First button (previous) should be disabled since we're at the first round
    expect(navButtons[0].classes()).toContain('opacity-50')

    // Second button (next) should be enabled
    expect(navButtons[1].classes()).not.toContain('opacity-50')
  })
})
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseTable from '../HorseTable.vue'

describe('HorseTable', () => {
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
      condition: 75
    }
  ]

  const mockResultsHorses = [
    {
      id: 12,
      name: 'Samet Aybaba',
      color: 'bg-teal-600',
      textColor: 'text-white',
      condition: 89,
      position: 1,
      luckFactor: 1.27
    },
    {
      id: 4,
      name: 'Ali Gültiken',
      color: 'bg-emerald-500',
      textColor: 'text-black',
      condition: 85,
      position: 2,
      luckFactor: 0.85
    }
  ]

  it('renders with custom title', () => {
    const wrapper = mount(HorseTable, {
      props: {
        horses: mockHorses,
        title: 'Test Horse Table'
      }
    })
    expect(wrapper.find('h3').text()).toBe('Test Horse Table')
  })

  it('displays the correct number of horses', () => {
    const wrapper = mount(HorseTable, {
      props: {
        horses: mockHorses
      }
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(2)
  })

  it('displays position numbers correctly for regular mode', () => {
    const wrapper = mount(HorseTable, {
      props: {
        horses: mockHorses
      }
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].find('td:nth-child(1)').text()).toBe('1')
    expect(rows[1].find('td:nth-child(1)').text()).toBe('2')
  })

  it('displays horse colors and IDs correctly', () => {
    const wrapper = mount(HorseTable, {
      props: {
        horses: mockHorses
      }
    })
    const rows = wrapper.findAll('tbody tr')

    // Check first horse
    const firstHorseIdCell = rows[0].find('td:nth-child(3) span')
    expect(firstHorseIdCell.text()).toBe('1')
    expect(firstHorseIdCell.classes()).toContain('bg-black')
    expect(firstHorseIdCell.classes()).toContain('text-white')

    // Check second horse
    const secondHorseIdCell = rows[1].find('td:nth-child(3) span')
    expect(secondHorseIdCell.text()).toBe('7')
    expect(secondHorseIdCell.classes()).toContain('bg-purple-600')
    expect(secondHorseIdCell.classes()).toContain('text-white')
  })

  it('displays results mode with luck factor column', () => {
    const wrapper = mount(HorseTable, {
      props: {
        horses: mockResultsHorses,
        resultMode: true
      }
    })

    // Check that luck factor column exists
    const headers = wrapper.findAll('thead th')
    expect(headers.length).toBe(5)
    expect(headers[4].text()).toBe('Luck')

    // Check luck factor values are displayed
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].find('td:nth-child(5)').text()).toContain('x1.27')
    expect(rows[1].find('td:nth-child(5)').text()).toContain('x0.85')

    // Check position uses position prop in results mode
    expect(rows[0].find('td:nth-child(1)').text()).toBe('1')
    expect(rows[1].find('td:nth-child(1)').text()).toBe('2')
  })
})
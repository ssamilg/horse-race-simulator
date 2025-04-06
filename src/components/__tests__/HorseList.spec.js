import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HorseList from '../HorseList.vue'

// Mock the constants import
vi.mock('@/constants/horses', () => ({
  HORSES: [
    {
      id: 1,
      name: 'Sergen Yalçın',
      color: 'bg-black',
      textColor: 'text-white',
      condition: 95
    },
    {
      id: 2,
      name: 'Metin Tekin',
      color: 'bg-gray-500',
      textColor: 'text-white',
      condition: 80
    },
    {
      id: 3,
      name: 'Feyyaz Uçar',
      color: 'bg-white',
      textColor: 'text-black',
      condition: 65
    }
  ]
}))

describe('HorseList', () => {
  it('renders properly with correct title', () => {
    const wrapper = mount(HorseList)
    expect(wrapper.find('h2').text()).toBe('Horses')
  })

  it('displays the correct number of horses', () => {
    const wrapper = mount(HorseList)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(3)
  })

  it('shows correct horse information', () => {
    const wrapper = mount(HorseList)
    const firstRow = wrapper.findAll('tbody tr')[0]

    expect(firstRow.find('td:nth-child(1)').text()).toContain('1')
    expect(firstRow.find('td:nth-child(2)').text()).toBe('Sergen Yalçın')
    expect(firstRow.find('td:nth-child(3)').text()).toContain('95')
  })

  it('applies the correct performance indicators', () => {
    const wrapper = mount(HorseList)
    const rows = wrapper.findAll('tbody tr')

    // High condition (95) should show up arrow
    expect(rows[0].find('td:nth-child(3) span:nth-child(2)').text()).toBe('↑')
    expect(rows[0].find('td:nth-child(3) span:nth-child(2)').classes()).toContain('text-green-600')

    // Medium condition (80) should show right arrow
    expect(rows[1].find('td:nth-child(3) span:nth-child(2)').text()).toBe('→')
    expect(rows[1].find('td:nth-child(3) span:nth-child(2)').classes()).toContain('text-amber-500')

    // Low condition (65) should show down arrow
    expect(rows[2].find('td:nth-child(3) span:nth-child(2)').text()).toBe('↓')
    expect(rows[2].find('td:nth-child(3) span:nth-child(2)').classes()).toContain('text-red-600')
  })
})
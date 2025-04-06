import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ChampionshipTable from '../ChampionshipTable.vue'

describe('ChampionshipTable', () => {
  const mockStandings = [
    {
      id: 7,
      name: 'Ricardo Quaresma',
      color: 'bg-purple-600',
      textColor: 'text-white',
      condition: 92,
      points: 27
    },
    {
      id: 1,
      name: 'Sergen Yalçın',
      color: 'bg-black',
      textColor: 'text-white',
      condition: 95,
      points: 22
    },
    {
      id: 4,
      name: 'Ali Gültiken',
      color: 'bg-emerald-500',
      textColor: 'text-black',
      condition: 85,
      points: 15
    }
  ]

  it('renders the championship title correctly', () => {
    const wrapper = mount(ChampionshipTable, {
      props: {
        standings: mockStandings
      }
    })
    expect(wrapper.find('h3').text()).toBe('Championship Standings')
  })

  it('displays the correct number of horses in the standings', () => {
    const wrapper = mount(ChampionshipTable, {
      props: {
        standings: mockStandings
      }
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(3)
  })

  it('displays the points correctly for each horse', () => {
    const wrapper = mount(ChampionshipTable, {
      props: {
        standings: mockStandings
      }
    })
    const rows = wrapper.findAll('tbody tr')

    expect(rows[0].find('td:nth-child(4)').text()).toBe('27')
    expect(rows[1].find('td:nth-child(4)').text()).toBe('22')
    expect(rows[2].find('td:nth-child(4)').text()).toBe('15')
  })

  it('applies special styling to top three positions', () => {
    const wrapper = mount(ChampionshipTable, {
      props: {
        standings: mockStandings
      }
    })
    const rows = wrapper.findAll('tbody tr')

    // First place should have yellow background
    expect(rows[0].classes()).toContain('bg-yellow-100')

    // Second place should have gray background
    expect(rows[1].classes()).toContain('bg-gray-200')

    // Third place should have orange background
    expect(rows[2].classes()).toContain('bg-orange-100')
  })

  it('displays horse information and IDs correctly', () => {
    const wrapper = mount(ChampionshipTable, {
      props: {
        standings: mockStandings
      }
    })
    const rows = wrapper.findAll('tbody tr')

    // First horse (Ricardo Quaresma)
    expect(rows[0].find('td:nth-child(2)').text()).toBe('Ricardo Quaresma')
    const firstIdCell = rows[0].find('td:nth-child(3) span')
    expect(firstIdCell.text()).toBe('7')
    expect(firstIdCell.classes()).toContain('bg-purple-600')

    // Second horse (Sergen Yalçın)
    expect(rows[1].find('td:nth-child(2)').text()).toBe('Sergen Yalçın')
    const secondIdCell = rows[1].find('td:nth-child(3) span')
    expect(secondIdCell.text()).toBe('1')
    expect(secondIdCell.classes()).toContain('bg-black')
  })
})
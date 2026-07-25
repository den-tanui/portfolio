import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

// jsdom doesn't implement localStorage — provide a mock
const createMockStore = () => {
  let store: Record<string, string> = {}
  const mock = {
    getItem(key: string) { return store[key] ?? null },
    setItem(key: string, value: string) { store[key] = value },
    removeItem(key: string) { delete store[key] },
    clear() { store = {} },
    get length() { return Object.keys(store).length },
    key(i: number) { return Object.keys(store)[i] ?? null },
  }
  return { mock, getStore: () => store }
}

describe('useLocalStorage', () => {
  let mockStore: { mock: Storage; getStore: () => Record<string, string> }

  beforeEach(() => {
    mockStore = createMockStore()
    Object.defineProperty(window, 'localStorage', {
      value: mockStore.mock,
      configurable: true,
    })
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'dark'))
    expect(result.current[0]).toBe('dark')
  })

  it('reads existing value from localStorage', () => {
    mockStore.mock.setItem('theme', JSON.stringify('light'))
    const { result } = renderHook(() => useLocalStorage('theme', 'dark'))
    expect(result.current[0]).toBe('light')
  })

  it('writes to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(mockStore.mock.getItem('key')!)).toBe('new-value')
  })

  it('handles JSON values correctly', () => {
    const initial = { count: 0, name: 'test' }
    const { result } = renderHook(() => useLocalStorage('data', initial))

    const updated = { count: 1, name: 'updated' }
    act(() => {
      result.current[1](updated)
    })

    expect(result.current[0]).toEqual(updated)
    expect(JSON.parse(mockStore.mock.getItem('data')!)).toEqual(updated)
  })

  it('handles localStorage error gracefully', () => {
    // Replace setItem with one that throws
    const throwingMock = {
      ...mockStore.mock,
      setItem: vi.fn().mockImplementation(() => {
        throw new Error('quota exceeded')
      }),
    }
    Object.defineProperty(window, 'localStorage', {
      value: throwingMock,
      configurable: true,
    })

    const { result } = renderHook(() => useLocalStorage('key', 'default'))

    act(() => {
      result.current[1]('new-value')
    })

    // Should not throw, value should update in state even if localStorage fails
    expect(result.current[0]).toBe('new-value')
  })
})

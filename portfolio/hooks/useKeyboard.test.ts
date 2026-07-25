import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKeyboard } from './useKeyboard'

function fireKey(key: string, target?: HTMLElement) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true })
  if (target) {
    vi.spyOn(event, 'target', 'get').mockReturnValue(target)
  }
  window.dispatchEvent(event)
}

describe('useKeyboard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the handler when matching key is pressed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: '?', handler }]))

    fireKey('?')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler for non-matching keys', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: 'Escape', handler }]))

    fireKey('a')
    expect(handler).not.toHaveBeenCalled()
  })

  it('calls preventDefault when preventDefault is true', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: '/', preventDefault: true, handler }]))

    const event = new KeyboardEvent('keydown', { key: '/', bubbles: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(handler).toHaveBeenCalled()
  })

  it('ignores event when target is input and ignoreWhenEditing is true (default)', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: '?', handler }]))

    const input = document.createElement('input')
    fireKey('?', input)
    expect(handler).not.toHaveBeenCalled()
  })

  it('handles event when ignoreWhenEditing is false and target is input', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard([{ key: '?', ignoreWhenEditing: false, handler }]))

    const input = document.createElement('input')
    fireKey('?', input)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('updates handler on re-render without re-registering', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const { rerender } = renderHook(
      (shortcuts) => useKeyboard(shortcuts),
      { initialProps: [{ key: 'g', handler: handler1 }] },
    )

    fireKey('g')
    expect(handler1).toHaveBeenCalledTimes(1)

    rerender([{ key: 'g', handler: handler2 }])

    fireKey('g')
    expect(handler2).toHaveBeenCalledTimes(1)
    // handler1 should not be called again
    expect(handler1).toHaveBeenCalledTimes(1)
  })
})

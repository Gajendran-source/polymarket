import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock any global browser APIs if needed
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as any

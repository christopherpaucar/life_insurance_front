import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { afterAll, beforeAll, vi } from "vitest";
import React from 'react'

// Extiende Vitest con los matchers de jest-dom
expect.extend(matchers as any)

// Mock localStorage
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

// Mock matchMedia
function mockMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', {
      ...props,
      fill: props.fill ? 'true' : undefined,
      src: props.src,
      alt: props.alt,
      className: props.className
    })
  },
}))

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Eye: () => React.createElement('span', { 'data-testid': 'eye-icon' }),
  EyeOff: () => React.createElement('span', { 'data-testid': 'eye-off-icon' }),
  AlertCircle: () => React.createElement('span', { 'data-testid': 'alert-circle-icon' }),
  AlertTriangle: () => React.createElement('span', { 'data-testid': 'alert-triangle-icon' }),
  BarChart3: () => React.createElement('span', { 'data-testid': 'bar-chart-icon' }),
  FileText: () => React.createElement('span', { 'data-testid': 'file-text-icon' }),
  Receipt: () => React.createElement('span', { 'data-testid': 'receipt-icon' }),
  History: () => React.createElement('span', { 'data-testid': 'history-icon' }),
  Download: () => React.createElement('span', { 'data-testid': 'download-icon' }),
  Plus: () => React.createElement('span', { 'data-testid': 'plus-icon' }),
  CreditCard: () => React.createElement('span', { 'data-testid': 'credit-card-icon' }),
  Calendar: () => React.createElement('span', { 'data-testid': 'calendar-icon' }),
}))

// Setup global mocks
beforeAll(() => {
  global.localStorage = new LocalStorageMock() as unknown as Storage;
  mockMatchMedia();
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  cleanup()
});

// Clean up after all tests
afterAll(() => {
  vi.resetAllMocks();
});

// Mock de fetch global
global.fetch = vi.fn()

// Mock de window.location
Object.defineProperty(window, 'location', {
  value: {
    reload: vi.fn(),
  },
  writable: true,
})

// Suprimir advertencias específicas
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Warning: ReactDOM.render is no longer supported')) {
    return;
  }
  if (typeof args[0] === 'string' && args[0].includes('Warning: `ReactDOMTestUtils.act` is deprecated')) {
    return;
  }
  originalError.call(console, ...args);
};

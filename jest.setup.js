import '@testing-library/jest-dom'

// Suppress Next.js Image warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: React does not recognize the `fetchPriority` prop')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Global test setup - mocks will be defined in individual test files
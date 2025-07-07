// Simple utility function test without external dependencies
describe('Basic Math Utils', () => {
  const formatPrice = (price: string) => {
    const amount = parseFloat(price)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice('25.99')).toBe('$25.99')
      expect(formatPrice('100')).toBe('$100.00')
      expect(formatPrice('0')).toBe('$0.00')
    })

    it('handles decimal prices', () => {
      expect(formatPrice('15.5')).toBe('$15.50')
      expect(formatPrice('99.99')).toBe('$99.99')
    })
  })
})
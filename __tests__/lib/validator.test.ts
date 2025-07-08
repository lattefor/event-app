import { eventFormSchema } from '@/lib/validator'

describe('Event Form Validation Schema', () => {
  describe('eventFormSchema', () => {
    it('validates valid event data', () => {
      const validData = {
        title: 'Test Event',
        description: 'This is a test event description',
        location: 'Test Location',
        imageUrl: 'https://example.com/image.jpg',
        startDateTime: new Date('2024-12-25T10:00:00Z'),
        endDateTime: new Date('2024-12-25T12:00:00Z'),
        categoryId: 'category123',
        price: '25.00',
        isFree: false,
        url: 'https://example.com'
      }

      const result = eventFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('rejects invalid title', () => {
      const invalidData = {
        title: 'Hi', // Too short
        description: 'This is a test event description',
        location: 'Test Location',
        imageUrl: 'https://example.com/image.jpg',
        startDateTime: new Date(),
        endDateTime: new Date(),
        categoryId: 'category123',
        price: '25.00',
        isFree: false,
        url: 'https://example.com'
      }

      const result = eventFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title must be at least 3 characters')
      }
    })

    it('rejects empty categoryId', () => {
      const invalidData = {
        title: 'Test Event',
        description: 'This is a test event description',
        location: 'Test Location',
        imageUrl: 'https://example.com/image.jpg',
        startDateTime: new Date(),
        endDateTime: new Date(),
        categoryId: '', // Empty category
        price: '25.00',
        isFree: false,
        url: 'https://example.com'
      }

      const result = eventFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please select a category')
      }
    })
  })
})
export const headerLinks = [
  {
    label: 'Home',
    route: '/',
    requiresAuth: false,
  },
  {
    label: 'Create Event',
    route: '/events/create',
    requiresAuth: true,
  },
  {
    label: 'My Profile',
    route: '/profile',
    requiresAuth: true,
  },
]

export const eventDefaultValues = {
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: '',
  price: '',
  isFree: false,
  url: '',
}

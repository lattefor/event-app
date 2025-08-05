# Evently - Modern Event Management Platform

A full-stack event management platform built with Next.js 14, featuring user authentication, event creation, ticket purchasing, and payment processing with global timezone support.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe with Webhooks
- **File Upload**: UploadThing
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## Key Features

- 🔐 User authentication with Clerk
- 📅 Event creation and management with form validation
- 🎫 Ticket purchasing with Stripe integration
- 🖼️ Image upload for events
- 📱 Responsive design
- 🔍 Event search and filtering
- 👤 User profile and dashboard
- 🌍 Global timezone support (client-side rendering)
- ⚡ Loading states and error handling
- 🧪 Comprehensive test suite

## Architecture Overview

### User ID Management (Important!)

This application uses **two different user ID systems**:

1. **Clerk ID** (`clerkId`): Primary identifier from Clerk authentication
   - Format: `user_2zCUoV38tN3iPBdUIjAmr3bvxX1`
   - Used for: Authentication, frontend operations
   - Source: `auth().userId` or `user.id`

2. **MongoDB ID** (`_id`): Database record identifier
   - Format: `ObjectId("6861b8a499beda03edc60caa")`
   - Used for: Database relationships, internal operations

### ID Conversion Pattern

```typescript
// Frontend: Always use Clerk ID
const { userId } = auth(); // Clerk ID

// Backend: Convert to MongoDB ID when needed
const user = await User.findOne({ clerkId: userId });
const mongoId = user._id; // MongoDB ObjectId
```

### Data Flow

```
User Signs Up → Clerk → UserCreator Component → MongoDB User Record
     ↓
User Creates Event → Form Validation → Event Actions → Store with UTC timestamps
     ↓
User Buys Ticket → Stripe Checkout → Webhook → Order Creation → MongoDB
     ↓
Display Events → Client-side Timezone Conversion → Local Time Display
```

### Timezone Handling

The application implements global timezone support:

1. **Storage**: All timestamps stored as UTC in MongoDB
2. **Input**: User selects times in their local timezone
3. **Display**: Client-side conversion to user's local timezone
4. **Components**: `ClientDateTime` component handles timezone-aware rendering

## Environment Variables

Create `.env.local` with:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
MONGODB_URI=mongodb+srv://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# App URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## Installation & Setup

```bash
# Clone repository
git clone <your-repo-url>
cd event-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (root)/              # Main app pages
│   │   ├── events/          # Event pages
│   │   └── profile/         # User profile
│   ├── api/                 # API routes
│   │   ├── webhooks/stripe/ # Stripe webhook endpoint
│   │   └── test-order/      # Test endpoint
│   └── layout.tsx           # Root layout with UserCreator
├── __tests__/               # Test suite
│   ├── components/          # Component tests
│   ├── api/                 # API tests
│   └── lib/                 # Utility tests
├── components/
│   ├── shared/              # Reusable components
│   │   ├── ClientDateTime.tsx # Timezone-aware component
│   │   ├── EventForm.tsx    # Form with validation
│   │   └── Dropdown.tsx     # Category dropdown
│   └── ui/                  # UI components
├── lib/
│   ├── actions/             # Server actions
│   ├── database/            # MongoDB models
│   ├── utils.ts             # Utilities with timezone support
│   └── validator.ts         # Zod schemas
├── types/                   # TypeScript types
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Test setup
└── middleware.ts            # Clerk middleware
```

## Key Components

### UserCreator Component
Automatically creates MongoDB user records when users sign in:

```typescript
// Runs on every page load
// Converts Clerk user → MongoDB user record
// Prevents "User not found" errors
```

### Authentication Flow
1. User signs up/in with Clerk
2. `UserCreator` component detects authentication
3. Creates user record in MongoDB with `clerkId`
4. User can now create events and make purchases

### Event Management
- Create events with images, pricing, categories
- Edit/delete own events only
- View organized events in profile

### Payment Processing
- Stripe integration for ticket purchases
- **Stripe webhooks** for reliable order creation
- Automatic order creation in MongoDB via webhook
- Success/cancel handling on profile page
- Loading states during form submission

### Form Validation
- Zod schema validation for all forms
- Real-time validation feedback
- Category selection validation
- Image upload requirements

### Timezone Support
- **ClientDateTime component** for timezone-aware rendering
- UTC storage in database
- Client-side timezone conversion
- Consistent time display across global users

## Important Notes

### Webhook Strategy
- **No Clerk webhooks**: User creation via client-side `UserCreator` component
- **Stripe webhooks**: Essential for reliable payment processing
- Webhook endpoint: `/api/webhooks/stripe`
- Handles `checkout.session.completed` events

### ID Consistency
Always remember the ID conversion pattern:
- **Frontend operations**: Use Clerk ID
- **Database queries**: Convert to MongoDB ID first
- **Relationships**: Store MongoDB IDs in database

### Common Issues & Solutions

1. **"User not found" errors**
   - Check if `UserCreator` component is in root layout
   - Verify user exists in MongoDB with correct `clerkId`

2. **Payment failures**
   - Ensure user exists in MongoDB before checkout
   - Check Stripe keys in environment variables
   - Verify webhook endpoint is accessible: `/api/webhooks/stripe`
   - Check middleware allows webhook route (no auth required)

3. **Timezone display issues**
   - Use `ClientDateTime` component for date display
   - Avoid server-side date formatting
   - Check client-side hydration

4. **Form validation errors**
   - Ensure category is selected before submission
   - Check Zod schema validation rules
   - Verify all required fields are filled

5. **Image upload issues**
   - Verify UploadThing configuration
   - Check file size limits (4MB max)

## Development Tips

1. **Debug user issues**:
```typescript
// Check current user
const { userId } = auth();
console.log('Clerk ID:', userId);

// Check MongoDB user
const user = await User.findOne({ clerkId: userId });
console.log('MongoDB user:', user);
```

2. **Test payment flow**:
   - Use Stripe test cards: `4242 4242 4242 4242`
   - Check success/cancel redirects work
   - Verify orders appear in profile

3. **Database queries**:
```typescript
// Always convert Clerk ID to MongoDB ID for relationships
const user = await User.findOne({ clerkId: userId });
const events = await Event.find({ organizer: user._id });
```

## Testing

The application includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test
npm test -- Card.test.tsx
```

### Test Structure
```
__tests__/
├── components/           # Component tests
│   ├── footer.test.tsx
│   └── simple.test.tsx
├── api/                  # API route tests
│   └── simple-order.test.ts
└── lib/                  # Utility tests
    ├── utils.test.ts
    └── validator.test.ts
```

### Testing Strategy
- **Component tests**: React Testing Library for UI components
- **API tests**: Mock external dependencies (Stripe, MongoDB)
- **Utility tests**: Pure function testing
- **Validation tests**: Zod schema validation

## Deployment

### Pre-deployment Checklist
```bash
# Test build locally
npm run build
npm run start

# Run all tests
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

### Production Setup
1. Deploy to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up Stripe webhook endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
4. Update `NEXT_PUBLIC_SERVER_URL` to production URL
5. Test payment flow end-to-end

### Stripe Webhook Configuration
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Development Best Practices

### Code Quality
```bash
# Pre-commit checks
npm run build    # Catches production issues
npm run lint     # Code quality
npx tsc --noEmit # TypeScript errors
npm test         # Run test suite
```

### Timezone Handling
- Always use `ClientDateTime` component for displaying dates
- Store all timestamps as UTC in database
- Let client-side handle timezone conversion

### Form Development
- Use Zod schemas for validation
- Add loading states for better UX
- Handle timeout scenarios (30-second limit)
- Validate required fields client and server-side

### Payment Integration
- Test with Stripe test cards: `4242 4242 4242 4242`
- Always verify webhook endpoints are accessible
- Check orders appear in user profile after purchase
- Handle both success and failure scenarios

## Troubleshooting

### Database Issues
```typescript
// Debug database connection
console.log('Connected to database:', mongoose.connection.name);

// Check user conversion
const user = await User.findOne({ clerkId: userId });
console.log('MongoDB user:', user);
```

### Timezone Issues
- Check if using `ClientDateTime` component
- Verify client-side hydration is working
- Test across different timezones

### Payment Issues
- Check Vercel function logs for webhook calls
- Verify Stripe webhook endpoint returns 200
- Ensure middleware allows webhook route
- Test webhook signature verification

### Test Issues
- Run `npm test` to see current test status
- Check Jest configuration for module resolution
- Verify mocks are properly set up

## Contributing

1. Follow the ID conversion patterns
2. Use `ClientDateTime` for all date displays
3. Add tests for new features
4. Validate forms with Zod schemas
5. Handle loading states and errors
6. Update this README for architectural changes

---

**Built with ❤️ using Next.js 14, TypeScript, and modern web technologies.**
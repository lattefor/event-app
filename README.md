# Evently - Modern Event Management Platform

A full-stack event management platform built with Next.js 14, featuring user authentication, event creation, ticket purchasing, and payment processing.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe
- **File Upload**: UploadThing
- **Deployment**: Vercel-ready

## Key Features

- 🔐 User authentication with Clerk
- 📅 Event creation and management
- 🎫 Ticket purchasing with Stripe
- 🖼️ Image upload for events
- 📱 Responsive design
- 🔍 Event search and filtering
- 👤 User profile and dashboard

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
User Creates Event → Event Actions → Find User by clerkId → Store MongoDB _id
     ↓
User Buys Ticket → Stripe → Order with MongoDB user._id
```

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
│   └── layout.tsx           # Root layout with UserCreator
├── components/
│   ├── shared/              # Reusable components
│   └── ui/                  # UI components
├── lib/
│   ├── actions/             # Server actions
│   ├── database/            # MongoDB models
│   └── utils.ts             # Utilities
└── types/                   # TypeScript types
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
- Automatic order creation in MongoDB
- Success/cancel handling on profile page

## Important Notes

### No Webhooks Used
This application **does not use Clerk webhooks**. Instead:
- User creation happens client-side via `UserCreator` component
- More reliable than webhook dependencies
- Simpler debugging and development

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

3. **Image upload issues**
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

## Deployment

1. Deploy to Vercel or similar platform
2. Update `NEXT_PUBLIC_SERVER_URL` to production URL
3. Configure production database and API keys
4. Test authentication and payment flows

## Contributing

1. Follow the ID conversion patterns
2. Test user creation flow thoroughly
3. Ensure proper error handling for missing users
4. Update this README for any architectural changes



## Test Before Production

1. Build Locally (Recommended)
# This runs the same checks as production
npm run build

# If build succeeds, test the production build
npm run start

2. TypeScript Check
# Check TypeScript errors without building
npx tsc --noEmit

3. Lint Check
# Check for code issues
npm run lint

## Why Dev vs Prod Difference?
* Development: Next.js shows TypeScript errors as warnings but continues running
* Production: Next.js treats TypeScript errors as build failures and stops
Best Practice Workflow:
# Before pushing to production:
npm run build    # ← This catches production issues
npm run lint     # ← This catches code quality issues
npx tsc --noEmit # ← This catches TypeScript issues

# If all pass, then push
git push

## Pro Tip:
Add this to your package.json scripts:

{
  "scripts": {
    "check": "npm run build && npm run lint && npx tsc --noEmit",
    "pre-deploy": "npm run check"
  }
}


Then just run:
npm run pre-deploy
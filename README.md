# Evently - Event Management Platform

A full-stack event management web application where users can create, browse, update, and delete events. Built with **Next.js 14**, **MongoDB**, **Clerk Authentication**, and **UploadThing** for file uploads.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router, Server Actions, and SSR |
| **TypeScript** | Type-safe development across the entire codebase |
| **MongoDB** | NoSQL database for storing events, users, categories, and orders |
| **Mongoose** | ODM library for MongoDB schema modeling and queries |
| **Clerk** | User authentication (sign-up, sign-in, session management) |
| **UploadThing** | File/image upload service for event images |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **Shadcn UI / Radix UI** | Accessible, styled UI component primitives (dialogs, selects, checkboxes) |
| **React Hook Form** | Form state management and submission handling |
| **Zod** | Schema-based form validation |
| **Svix** | Webhook signature verification for Clerk events |
| **React Datepicker** | Date and time picker for event scheduling |
| **Vercel** | App hosting and deployment |

---

## How It All Works Together

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  Pages ─── Components ─── Server Actions            │
└──────┬──────────┬──────────────┬────────────────────┘
       │          │              │
       │          │              ▼
       │          │     ┌────────────────┐
       │          │     │   MongoDB      │
       │          │     │  (Mongoose)    │
       │          │     │                │
       │          │     │ • Users        │
       │          │     │ • Events       │
       │          │     │ • Categories   │
       │          │     │ • Orders       │
       │          │     └────────────────┘
       │          │
       ▼          ▼
┌───────────┐  ┌──────────────┐
│   Clerk   │  │ UploadThing  │
│   (Auth)  │  │  (Uploads)   │
└───────────┘  └──────────────┘
```

### 1. Authentication Flow (Clerk)

Clerk handles all user authentication. The app connects to Clerk using API keys stored in environment variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Used on the client side to initialize Clerk
- `CLERK_SECRET_KEY` - Used on the server side for secure API calls

**How it works:**
1. Users sign up or sign in via Clerk's pre-built UI components at `/sign-in` and `/sign-up`
2. Clerk middleware (`middleware.ts`) protects routes - only the homepage, event details, and webhook/upload API routes are public
3. When a user is created/updated/deleted in Clerk, a **webhook** is sent to `/api/webhook/clerk`
4. The webhook handler verifies the signature using **Svix**, then syncs the user data to MongoDB via Server Actions (`createUser`, `updateUser`, `deleteUser`)
5. This keeps the MongoDB `User` collection in sync with Clerk's user records

### 2. Database Layer (MongoDB + Mongoose)

The app connects to MongoDB Atlas using the `MONGODB_URI` environment variable. Mongoose manages the connection with a **cached singleton pattern** to avoid multiple connections in serverless environments.

**Database Models:**

- **User** - Stores `clerkId`, email, username, first/last name, and photo. Linked to Clerk via `clerkId`.
- **Event** - Stores title, description, location, dates, price, image URL, and references to `User` (organizer) and `Category` via ObjectId.
- **Category** - Simple name-based model for event categorization.
- **Order** - Stores Stripe payment ID, total amount, and references to `Event` and `User` (buyer).

**How the database connects to the frontend:**
1. Server Actions (in `lib/actions/`) call `connectToDatabase()` which uses the `MONGODB_URI` key to establish a Mongoose connection
2. These Server Actions are called directly from Next.js pages and components - no separate REST API needed
3. Mongoose `populate()` is used to resolve references (e.g., loading organizer name and category name when fetching events)

### 3. File Uploads (UploadThing)

Event images are uploaded via UploadThing:

1. The `FileUploader` component provides a drag-and-drop upload UI
2. Files are sent to UploadThing's API route (`/api/uploadthing`)
3. UploadThing returns a hosted URL, which is stored in the event's `imageUrl` field in MongoDB

### 4. Event Management (Server Actions)

All data operations use Next.js **Server Actions** (`"use server"`) instead of traditional API routes:

- **Create Event** - Validates form data with Zod, creates a new event document with organizer and category references
- **Read Events** - Supports search by title (regex), category filtering, pagination (6 per page), and sorting by creation date
- **Update Event** - Verifies the current user is the organizer before allowing updates
- **Delete Event** - Removes the event and revalidates the page cache
- **Related Events** - Fetches events in the same category (excluding the current one)

### 5. Frontend Components

The UI is built with reusable components using Shadcn UI (built on Radix UI) and styled with Tailwind CSS:

- **Header / Footer / MobileNav** - App shell and responsive navigation
- **EventForm** - Shared form for create and update, using React Hook Form + Zod validation + React Datepicker
- **Collection** - Displays a grid of event cards with pagination
- **Search** - Real-time search with URL query parameter updates
- **CategoryFilter / CategoryDropdown** - Filter events by category
- **DeleteConfirmation** - Alert dialog before deleting an event
- **Card** - Individual event card with image, title, price, and organizer info

---

## Project Structure

```
evently/
├── app/
│   ├── (auth)/                  # Auth pages (sign-in, sign-up)
│   ├── (root)/                  # Main app pages
│   │   ├── page.tsx             # Homepage - lists all events
│   │   ├── events/
│   │   │   ├── create/          # Create event page
│   │   │   └── [id]/            # Event details & update pages
│   │   ├── orders/              # Orders page
│   │   └── profile/             # User profile page
│   ├── api/
│   │   ├── uploadthing/         # File upload API route
│   │   └── webhook/clerk/       # Clerk webhook handler
│   └── layout.tsx               # Root layout with Clerk provider
├── components/
│   ├── shared/                  # App-specific components
│   └── ui/                      # Shadcn / Radix-based UI primitives
├── lib/
│   ├── actions/                 # Server Actions (event, user, category)
│   ├── database/
│   │   ├── index.ts             # MongoDB connection (uses MONGODB_URI)
│   │   └── models/              # Mongoose schemas (User, Event, Order, Category)
│   ├── utils.ts                 # Utility functions
│   └── validator.ts             # Zod form validation schemas
├── middleware.ts                # Clerk auth middleware (route protection)
└── types/                       # TypeScript type definitions
```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Clerk Webhook (for user sync)
WEBHOOK_SECRET=whsec_...
```

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd evently
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env.local` file and fill in the keys listed above
   - Set up a [MongoDB Atlas](https://cloud.mongodb.com/) cluster and get the connection string
   - Create a [Clerk](https://clerk.com/) application and get the API keys
   - Set up [UploadThing](https://uploadthing.com/) and get the credentials
   - Configure a Clerk webhook pointing to `<your-domain>/api/webhook/clerk`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

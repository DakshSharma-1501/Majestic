# TurfBook - Premium Turf Booking System

A production-ready turf booking platform built with Next.js 16, Supabase, and Bun. Features role-based access control, real-time notifications, and QR code verification.

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Runtime:** Bun
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + custom components
- **Deployment:** Vercel

## ✨ Features

### For Customers
- Browse available turfs
- View turf details with sports and time slots
- Book slots with instant confirmation
- Real-time booking status updates
- QR code for verified bookings
- Booking history dashboard

### For Turf Owners
- Create and manage turfs
- Add sports and configure pricing
- Create time slots
- Accept/reject booking requests
- QR code scanner for attendance verification
- Real-time booking notifications

### Technical Features
- **Role-Based Access Control:** Customer and Owner roles with separate permissions
- **Real-time Updates:** Supabase Realtime for instant notifications
- **QR Code System:** Secure QR generation and verification with HMAC
- **Row Level Security:** Database-level security policies
- **Mobile-First Design:** Apple-style UI with responsive layouts
- **Type-Safe:** Full TypeScript support

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd turf-booking-system
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the migration SQL from `supabase/migrations/001_initial_schema.sql` in the Supabase SQL Editor
   - Copy your project URL and keys

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   QR_SECRET=your-random-secret-for-qr-codes
   ```

5. **Run the development server**
   ```bash
   bun dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The system uses the following tables:

- **profiles** - User profiles with role information
- **turfs** - Turf listings owned by users
- **sports** - Sports available at each turf
- **slots** - Time slots for each sport
- **bookings** - Booking records with status tracking

All tables have Row Level Security (RLS) policies enforcing role-based access.

## 🔐 Authentication Flow

1. User signs up and selects role (Customer or Owner)
2. Profile is created in `profiles` table
3. Role is stored in both user metadata and profiles table
4. RLS policies enforce access based on role

## 📱 User Flows

### Customer Flow
1. Browse turfs on landing page
2. Click on a turf to view details
3. Select sport and available time slot
4. Enter number of players and book
5. Booking status starts as "pending"
6. Receive real-time notification when owner accepts
7. View QR code in booking details
8. Show QR code at turf for verification

### Owner Flow
1. Create turf with details and images
2. Add sports with pricing and player limits
3. Create time slots for each sport
4. View incoming booking requests in dashboard
5. Accept or reject bookings
6. On acceptance, QR code is auto-generated
7. Scan customer QR code to verify attendance
8. System validates booking and time slot

## 🎨 Design System

The UI follows Apple's design principles:

- **Colors:** Soft gradients with blue and purple accents
- **Shadows:** Subtle, layered shadows for depth
- **Spacing:** Generous whitespace for clarity
- **Typography:** System fonts with -apple-system stack
- **Animations:** Smooth transitions and micro-interactions
- **Mobile:** Bottom navigation for easy thumb access

## 🔄 Real-time Features

The system uses Supabase Realtime for:

- Booking status updates (pending → accepted/rejected)
- Dashboard notifications
- Slot availability changes

## 🔒 Security

- **RLS Policies:** Database-level access control
- **Auth Middleware:** Protected routes require authentication
- **Role Validation:** API routes verify user roles
- **QR Security:** HMAC-based QR code generation
- **Time Validation:** QR codes expire after 24 hours
- **Slot Validation:** Check-in allowed 30 min before slot

## 📁 Project Structure

```
turf-booking-system/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Customer & Owner dashboards
│   ├── turfs/               # Turf pages
│   ├── bookings/            # Booking details
│   ├── scan-qr/             # QR scanner
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── booking/             # Booking components
│   ├── turf/                # Turf components
│   └── qr/                  # QR components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── utils.ts             # Utility functions
│   └── qr-utils.ts          # QR code utilities
├── types/                   # TypeScript types
└── supabase/
    └── migrations/          # Database migrations
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Configure Supabase**
   - Add your Vercel deployment URL to Supabase Auth allowed URLs
   - Update redirect URLs in Supabase dashboard

## 🧪 Testing

1. **Create test accounts**
   - Sign up as a Customer
   - Sign up as an Owner (use different email)

2. **Test Owner flow**
   - Create a turf
   - Add sports (Football, Cricket, etc.)
   - Create time slots

3. **Test Customer flow**
   - Browse turfs
   - Book a slot
   - Check dashboard for pending booking

4. **Test acceptance flow**
   - Login as Owner
   - Accept the booking
   - Verify QR code is generated

5. **Test QR verification**
   - Login as Owner
   - Go to Scan QR page
   - Scan the customer's QR code

## 📝 API Routes

- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking status
- `POST /api/qr/verify` - Verify QR code
- `POST /api/turfs` - Create turf
- `POST /api/sports` - Add sport
- `POST /api/slots` - Create slots

## 🐛 Troubleshooting

**Issue:** "Unauthorized" errors
- **Solution:** Check if user is logged in and has correct role

**Issue:** QR code not generating
- **Solution:** Ensure booking status is "accepted" and QR_SECRET is set

**Issue:** Real-time updates not working
- **Solution:** Verify Realtime is enabled in Supabase project settings

**Issue:** Build errors
- **Solution:** Run `bun install` and ensure all dependencies are installed

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For support, please open an issue on GitHub.

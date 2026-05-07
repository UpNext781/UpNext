# UpNext Setup Guide

## Getting Started

### 1. **Database Setup**

You need to initialize your Supabase database with the schema and sample data.

#### Steps:
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the contents of `init.sql` to create all tables
4. Run the contents of `seed.sql` to add sample data

**Tables created:**
- `users` - Authentication and user roles
- `entertainer_profiles` - Entertainer information and status
- `clubs` - Club/venue information
- `lineups` - Performance schedules

### 2. **Environment Configuration**

**Frontend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Backend (.env):**
```
DATABASE_URL=your_database_url
PORT=3001
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 3. **Running the Application**

**Terminal 1 - Frontend (Next.js):**
```bash
cd upnext-web
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Backend (Node/Express with Socket.io):**
```bash
$env:PORT=3001; node server.js
# Runs on http://localhost:3001
```

### 4. **User Flows**

#### Entertainer:
1. Login → Dashboard → Check In
2. Select club and set status (Off Duty / In Building / On Stage)
3. Safety timer activates when "On Stage"

#### Patron:
1. Login → Dashboard → Browse Clubs
2. View live lineup (Stage View)
3. Follow favorite entertainers

#### Manager:
1. Login → Dashboard → Lineup Manager
2. Add/remove performers and reorder schedule

### 5. **Key Features Implemented**

✅ Authentication (Supabase)
✅ Real-time lineup updates (Socket.io)
✅ Entertainer check-in system
✅ Safety timer for entertainers
✅ Patron discovery and lineup browsing
✅ Admin lineup management
✅ Responsive design (mobile-friendly)
✅ Error handling and loading states
✅ Stripe integration setup
✅ Environment security (.env.local ignored in git)

### 6. **API Endpoints**

**GET** `/` - Server status check
**POST** `/api/lineup/update` - Update lineup via REST

### 7. **Real-time Events (Socket.io)**

- `updateLineup` - Broadcast lineup changes
- `updateStatus` - Broadcast entertainer status changes
- `lineupChanged` - Receive lineup updates
- `statusChanged` - Receive status updates

### 8. **Next Steps**

- Set up production database
- Configure Stripe (create products and prices)
- Deploy frontend to Vercel
- Deploy backend to a server/cloud platform
- Set up proper CORS policies
- Add SSL certificates for production

### 9. **Troubleshooting**

**Login not working:** Ensure `.env.local` has correct Supabase credentials
**Real-time updates not showing:** Verify backend is running on port 3001
**Database errors:** Check DATABASE_URL in `.env` is correct

---

For detailed project information, see:
- [PRD.md](planning/PRD.md) - Project Requirements
- [TECH_STACK.md](planning/TECH_STACK.md) - Technology Stack
- [USER_FLOW.md](planning/USER_FLOW.md) - User Flows
- [STAGE_VIEW_DESIGN.md](planning/STAGE_VIEW_DESIGN.md) - UI Design

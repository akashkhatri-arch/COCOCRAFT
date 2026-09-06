# COCOCRAFT — Premium Custom Chocolate E-Commerce

COCOCRAFT is a premium custom chocolate e-commerce web application. Customers can create original, personalized chocolates by choosing the chocolate type, size, add-ons/toppings, and adding custom names or dedications. They can preview their creation in a live visual configuration builder and purchase their customized order with Razorpay payment integration.

## Technology Stack

- **Frontend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Zustand
- **Backend:** Next.js Server Actions / Route Handlers
- **Database:** Supabase PostgreSQL with RLS
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth
- **Payments:** Razorpay (Signature verification, secure webhook)

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- pnpm (recommended) or npm

### Local Setup

1. **Clone the repository and enter the directory:**
   ```bash
   cd cococraft
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the application.

5. **Lint and format checks:**
   ```bash
   pnpm lint
   ```

6. **Production Build:**
   ```bash
   pnpm build
   ```

## Development Phases

1. **Phase 1:** Project Foundation (Current)
2. **Phase 2:** Design System
3. **Phase 3:** Database Schema & Migrations
4. **Phase 4:** Supabase Integration
5. **Phase 5:** Homepage
6. **Phase 6:** Product Catalog
7. **Phase 7:** Product Detail
8. **Phase 8:** Custom Chocolate Builder (Hero feature)
9. **Phase 9:** Cart System
10. **Phase 10:** Authentication
11. **Phase 11:** Checkout
12. **Phase 12:** Razorpay Integration
13. **Phase 13:** Orders System
14. **Phase 14:** Admin Dashboard
15. **Phase 16–21:** Inventory, Coupons, Reviews, SEO, testing, and production deployment.

For a detailed roadmap, see `PROJECT_PLAN.md`.

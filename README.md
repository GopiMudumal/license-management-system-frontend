# License Management System - Frontend

Next.js frontend application for the License Management System with a modern, themeable UI.

## Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (built on Radix UI)
- **Icons**: Lucide React
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Package Manager**: pnpm (recommended)

## Features

### 🎨 Theming System
- **5 Beautiful Themes**: Avengers, Disney, Power Rangers, Ramayan, and KGF
- **Theme Toggle**: Switch between themes with a dropdown menu
- **Persistent Theme**: Theme preference saved in localStorage
- **Theme-Aware Components**: All components adapt to the selected theme

### ⚡ Global Loader
- **Theme-Aware Animations**: Loader matches the current theme
- **Configurable Duration**: Set minimum loading time via environment variable
- **Beautiful Animations**: Rotating rings, floating particles, and smooth transitions
- **Automatic Display**: Shows automatically on all API calls

### 👨‍💼 Admin Features
- Dashboard with system metrics
- Customer management (CRUD operations)
- Subscription pack management (Create, Read, Update, Delete)
- Subscription management:
  - Approve/Reject subscription requests
  - Pause/Activate subscriptions
  - Update subscription status and expiration
  - Delete subscriptions
  - Manual expiration checking
  - Quick expiration testing (1 min, 5 min, 10 min, 30 min)
- View all subscriptions with pagination
- Real-time expiration countdown display

### 👤 Customer Features
- Registration and login
- View current subscription with formatted validity
- Request new subscriptions
- Deactivate subscriptions
- View subscription history
- Formatted validity display (e.g., "1 year 3 months")

## Setup

1. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

2. **Set environment variables** (create `.env.local` file):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_MIN_LOADING_TIME=5000
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8080`)
- `NEXT_PUBLIC_MIN_LOADING_TIME`: Minimum loading time in milliseconds (default: `5000`). Set to `0` to use actual API response time.

3. **Run the development server:**
```bash
pnpm dev
# or
npm run dev
```

4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── admin/              # Admin pages
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── customers/      # Customer management
│   │   ├── packs/          # Subscription pack management
│   │   ├── subscriptions/  # Subscription management
│   │   └── login/          # Admin login
│   ├── customer/           # Customer pages
│   │   ├── dashboard/      # Customer dashboard
│   │   ├── subscription/   # Subscription management
│   │   ├── history/        # Subscription history
│   │   ├── login/          # Customer login
│   │   └── signup/         # Customer registration
│   ├── layout.tsx          # Root layout with theme initializer
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles with theme variables
│
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── GlobalLoader.tsx    # Global loading component
│   ├── Layout.tsx          # Main layout with navigation
│   ├── ThemeToggle.tsx     # Theme selector component
│   └── ThemeInitializer.tsx # Theme initialization
│
└── lib/
    ├── api.ts              # Axios instance with interceptors
    ├── format-validity.ts  # Validity formatting utility
    ├── store.ts            # Zustand auth store
    ├── theme-store.ts      # Zustand theme store
    └── utils.ts            # Utility functions (cn, etc.)
```

## Pages

### Public Pages
- `/` - Home page with theme toggle

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard with metrics
- `/admin/customers` - Customer management
- `/admin/packs` - Subscription pack management
- `/admin/subscriptions` - Subscription management with expiration controls

### Customer Pages
- `/customer/login` - Customer login
- `/customer/signup` - Customer registration
- `/customer/dashboard` - Customer dashboard
- `/customer/subscription` - Subscription management
- `/customer/history` - Subscription history

## Key Features Explained

### Theme System
The application supports 5 distinct themes, each with unique color palettes:
- **Avengers**: Dark blue/black with red & gold accents
- **Disney**: Magical purple/pink with blue accents
- **Power Rangers**: Bold red/blue/green with yellow accents
- **Ramayan**: Divine gold/orange with deep blue accents
- **KGF**: Dark gold/black with amber accents

Themes are applied via CSS variables and persist across sessions.

### Global Loader
- Automatically shows on API calls
- Theme-aware animations and colors
- Configurable minimum display duration
- Smooth fade in/out transitions
- Handles concurrent API requests

### Validity Formatting
The `formatValidity` utility converts months to human-readable format:
- `1` → "1 month"
- `12` → "1 year"
- `13` → "1 year 1 month"
- `24` → "2 years"

## Development

### Adding New Components
Components are built using shadcn/ui. To add a new component:

```bash
npx shadcn-ui@latest add [component-name]
```

### Styling
- Use Tailwind CSS classes
- Theme variables are available via CSS custom properties
- Components automatically adapt to the current theme

### State Management
- **Auth State**: Managed via Zustand (`lib/store.ts`)
- **Theme State**: Managed via Zustand (`lib/theme-store.ts`)

## API Integration

The frontend communicates with the backend via Axios. The API client (`lib/api.ts`) includes:
- Automatic JWT token injection
- 401 error handling with redirect
- Loading state management
- Request/response interceptors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Flow Diagrams

For detailed flow diagrams of the frontend architecture, component flows, theme system, and user interactions, see [DIAGRAMS.md](./DIAGRAMS.md).

## License

MIT

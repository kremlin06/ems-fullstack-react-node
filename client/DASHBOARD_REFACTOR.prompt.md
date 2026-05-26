# Dashboard Refactor Prompt for Qwen

## Context
The Event Management System has multiple user roles (Admin, Staff, Organizer, Attendee), each requiring a different dashboard experience. Currently, there's a single `Dashboard.jsx` that doesn't distinguish roles or provide role-specific features.

## Task
Rewrite the current `Dashboard.jsx` to become `AdminDashboard.jsx` with clear architecture that supports future `StaffDashboard.jsx`, `OrganizerDashboard.jsx`, and `AttendeeDashboard.jsx` components.

## Design Principles

### 1. Modularity
- Extract reusable dashboard components into separate, purpose-built modules
- Create dashboard-specific sub-components (e.g., `components/Dashboards/Admin/`, `components/Dashboards/Staff/`)
- Each component should have a single responsibility and be composable
- Avoid dashboard-specific logic leaking into shared components

### 2. Reusability
- Create abstract/generic component patterns that work across all dashboard types
- Example: A `<StatCard>` should work for any dashboard by accepting data, icons, colors as props
- Build a component library for dashboard elements: card layouts, stat displays, action menus, data tables
- Share layout patterns using styled-component abstractions (e.g., `DashboardLayout`, `ContentGrid`)
- Extract common hooks (e.g., `useDashboardStats`, `useFetchDashboardData`)

### 3. Separation of Concerns
- **Presentation Logic**: Components render UI based on props
- **Business Logic**: Hooks handle data fetching, calculations, filtering
- **State Management**: Use context for role-specific data (AuthContext already provides user role)
- **Styling**: All colors, spacing, shadows from `src/styles/theme.js` — no hardcoded values
- **API Integration**: Service layer (`src/services/dashboards.js`) handles API calls by role

## Architecture Recommendation

```
src/
├── pages/
│   ├── Dashboard.jsx                    ← Router that dispatches to role-specific dashboard
│   ├── AdminDashboard.jsx              ← NEW: Admin role dashboard
│   ├── StaffDashboard.jsx              ← Future: Staff role dashboard
│   ├── OrganizerDashboard.jsx          ← Future: Organizer role dashboard
│   └── AttendeeDashboard.jsx           ← Future: Attendee role dashboard
├── components/
│   └── Dashboards/
│       ├── Shared/                      ← Reusable dashboard components
│       │   ├── StatCard.jsx             ← Generic stat card
│       │   ├── DashboardLayout.jsx      ← Common layout grid
│       │   ├── ActionCard.jsx           ← Action/button card
│       │   ├── DataTable.jsx            ← Generic data table
│       │   └── ChartContainer.jsx       ← Chart wrapper with theme support
│       └── Admin/                       ← Admin-specific components
│           ├── AdminStats.jsx           ← Admin stat cards calculation
│           ├── EventManagementSection.jsx
│           ├── AttendanceOverview.jsx
│           ├── AdminActivityLog.jsx
│           └── QuickActionMenu.jsx
├── hooks/
│   └── dashboards/
│       ├── useAdminDashboard.js        ← Fetch admin-specific data
│       ├── useStaffDashboard.js        ← Future: Staff data
│       └── useDashboardStats.js        ← Shared stats calculation logic
├── services/
│   └── dashboards.js                   ← API calls for dashboard data (filtered by role)
└── styles/
    ├── theme.js                         ← SINGLE SOURCE OF TRUTH for all design tokens
    └── Dashboards.styles.js             ← Dashboard-specific styled components
```

## Theme Integration Requirements

**All styling must reference `src/styles/theme.js`:**

```javascript
// ✅ GOOD - Use theme variables
const StatCardContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.md};
  transition: all ${props => props.theme.transitions.default};
`;

// ❌ BAD - Hardcoded values
const StatCardContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
`;
```

**Use semantic color tokens for role-based theming:**
- `theme.colors.accentPrimary` for primary actions (Admin: blue, Staff: green, Organizer: purple)
- `theme.colors.statusSuccess`, `statusWarning`, `statusError`, `statusInfo` for status indicators
- `theme.colors.bgPrimary`, `bgSecondary`, `bgTertiary` for card/section backgrounds
- `theme.spacing.*` for consistent padding/margins
- `theme.borderRadius.*` for consistent border radius

## Key Deliverables

### 1. AdminDashboard.jsx
- **Purpose**: Main admin dashboard for event management, attendance tracking, system analytics
- **Features**:
  - Admin-specific stat cards (total events, active attendees, pending approvals)
  - Event management quick actions (create, edit, delete)
  - Attendance overview by event/department
  - System activity log (user registrations, event changes, etc.)
  - Admin notifications (pending approvals, system alerts)
  - Reports/analytics section
- **Data Source**: Mock `useAdminDashboard()` hook → future API integration

### 2. Reusable Components Library
- `StatCard.jsx`: Accepts `label`, `value`, `icon`, `color`, `trend`, `onClick` props
- `DashboardLayout.jsx`: Grid wrapper with responsive breakpoints from `theme.breakpoints`
- `ActionCard.jsx`: Card with icon, label, description, onClick
- `DataTable.jsx`: Generic table with sorting, filtering, pagination (theme-aware)
- `ChartContainer.jsx`: Wrapper for any chart library (ApexCharts, Recharts) with theme colors

### 3. Dashboard Router (Dashboard.jsx)
```javascript
// Route to correct dashboard based on user role
const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'Admin') return <AdminDashboard />;
  if (user?.role === 'Staff') return <StaffDashboard />;
  if (user?.role === 'Organizer') return <OrganizerDashboard />;
  return <AttendeeDashboard />;
};
```

### 4. useAdminDashboard Hook
- Fetch admin-specific data (events, attendees, reports)
- Calculate admin stats
- Handle filters/sorting
- Mock data for development

### 5. Dashboard Styles (Dashboards.styles.js)
- All styled-components reference `theme.js`
- Responsive grid layouts using `theme.breakpoints`
- Consistent spacing with `theme.spacing.*`
- Card styling with `theme.shadows`, `theme.borderRadius`, `theme.colors`

## Code Quality Standards

1. **No Hardcoded Values**: Every color, spacing, shadow must come from `theme.js`
2. **Prop Documentation**: Add JSDoc comments explaining accepted props
3. **Error Handling**: Graceful fallbacks for missing data, failed API calls
4. **Loading States**: Show skeleton loaders, spinners, or placeholder content
5. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
6. **Type Safety**: Use prop-types or TypeScript for component contracts

## File Naming Conventions

- **Dashboard containers**: `{Role}Dashboard.jsx` (e.g., `AdminDashboard.jsx`)
- **Sub-components**: Descriptive names in role folders (e.g., `EventManagementSection.jsx`)
- **Hooks**: `use{Feature}.js` (e.g., `useAdminDashboard.js`)
- **Services**: `dashboards.js` for API calls
- **Styles**: `{Feature}.styles.js` (e.g., `AdminDashboard.styles.js`)

## Testing/Validation Checklist

After implementation:
- ✅ AdminDashboard renders without errors
- ✅ All colors use `theme.colors.*`
- ✅ All spacing uses `theme.spacing.*`
- ✅ All shadows use `theme.shadows.*`
- ✅ Theme toggle (light/dark) works correctly on Admin dashboard
- ✅ Responsive design works on mobile/tablet/desktop (use `theme.breakpoints`)
- ✅ Components are reusable (no Admin-specific hardcoding in shared components)
- ✅ Role-based routing works (`Dashboard.jsx` → correct dashboard component)
- ✅ Mock data loads and displays correctly
- ✅ Icons, buttons, links are accessible

## Notes for Qwen

- This is a **foundational refactor** for a multi-role system. Quality architecture now prevents chaos later.
- Don't worry about Staff/Organizer/Attendee dashboards yet — just build AdminDashboard and reusable patterns
- Focus on **making AdminDashboard a template** that other roles can follow
- Leverage the existing `theme.js` (50+ design tokens) — it's already there, use it everywhere
- Keep components **small and composable** — prefer many small components over a few giant ones
- The `useAuth()` hook already provides `user.role` — use it for conditional rendering
- Mock APIs with `setTimeout` delays (like `src/services/auth.js`) to keep UI/backend development parallel
- This architecture sets the precedent for how the entire app scales; keep it clean

## Current File to Refactor
- Source: `src/pages/Dashboard.jsx`
- Outcome: `src/pages/AdminDashboard.jsx` + supporting components + shared library

Good luck! 🚀

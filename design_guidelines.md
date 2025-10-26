# Design Guidelines: Twitter & SVM Wallet Activity Tracker

## Design Approach

**Selected Framework:** Material Design with dashboard-optimized patterns
**Justification:** Information-dense application requiring clear data hierarchy, real-time updates, and gamification elements. Material Design provides robust components for tables, cards, and progress indicators while maintaining visual clarity.

**Key Design Principles:**
- Data clarity over decoration
- Scannable information hierarchy
- Immediate feedback for user actions
- Gamification elements that motivate without overwhelming

---

## Typography System

**Primary Font:** Inter (Google Fonts)
**Accent Font:** JetBrains Mono for numerical data and wallet addresses

**Hierarchy:**
- Page Headers: text-4xl/text-5xl, font-bold
- Section Headers: text-2xl/text-3xl, font-semibold
- Card Titles: text-lg/text-xl, font-semibold
- Body Text: text-base, font-normal
- Data Labels: text-sm, font-medium, uppercase tracking-wide
- Numerical Data: text-lg/text-2xl, font-mono, font-bold
- Wallet Addresses: text-xs, font-mono

---

## Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
**Container:** max-w-7xl with px-4 md:px-6 lg:px-8
**Grid System:** 12-column responsive grid

**Standard Spacing:**
- Section padding: py-8 md:py-12
- Card padding: p-6 md:p-8
- Component gaps: gap-4 md:gap-6
- List item spacing: space-y-4

---

## Component Library

### Navigation
**Header:**
- Fixed top navigation with backdrop-blur
- Logo left, main navigation center, user profile/points right
- Height: h-16 md:h-20
- Include: Dashboard, Activity, Leaderboard, Rewards, Settings
- Points badge: Prominent display with icon, animated on point gain

### Dashboard Layout
**Main Structure:**
- Sidebar navigation (hidden on mobile, drawer)
- Main content area: grid-cols-1 lg:grid-cols-3 layout
- Stats overview: 3-column grid spanning full width
- Activity feeds: 2-column split (Twitter left, SVM right) on desktop

### Core Components

**Stats Cards:**
- Rounded-xl with subtle border
- Icon + Label + Large Number + Trend Indicator
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Examples: Total Points, Twitter Engagement, Wallet Transactions, Current Rank

**Activity Feed Cards:**
- Reverse chronological list
- Each item: Avatar/Icon + Activity Type + Timestamp + Points Earned
- Infinite scroll with skeleton loaders
- Max height with overflow-y-scroll
- Real-time updates with subtle animation

**Twitter Activity Section:**
- Tweet cards with: Profile image, username, tweet text preview, engagement metrics
- Action buttons: Like, Retweet, Reply counts
- Points earned badge overlaid on top-right
- Click to view full tweet

**SVM Wallet Section:**
- Transaction list: Type, Amount, Token, Timestamp, Points
- Wallet balance card: Current balance + 24h change
- Transaction type icons (send, receive, swap, stake)
- Monospace font for addresses and amounts

**Points Tracker:**
- Progress bar to next tier/reward
- Daily/Weekly/All-time tabs
- Points history graph (line chart)
- Breakdown by activity type (pie chart)

**Leaderboard:**
- Table with ranking, user, points, trend
- Current user row highlighted
- Top 3 with special badges/styling
- Pagination: 50 users per page

**Chatbot Interface:**
- Fixed bottom-right floating button (60x60px)
- Slide-up panel (w-full md:w-96, max-h-[600px])
- Chat bubbles: User (right, primary color), Bot (left, neutral)
- Input field with send button
- Suggested queries as chips
- Example queries: "Show my top tweets", "Wallet balance", "How do I earn more points?"

### Forms & Inputs
**Connection Cards:**
- Twitter Connect: Large button with Twitter logo + "Connect Twitter Account"
- Wallet Connect: Input field for wallet address + verification button
- Status indicator: Connected (green check) / Disconnected (gray)

### Data Displays
**Tables:**
- Alternating row backgrounds for readability
- Sticky headers on scroll
- Sort indicators on column headers
- Responsive: Card layout on mobile

**Charts:**
- Use Chart.js or Recharts
- Consistent grid styling
- Tooltips on hover
- Responsive sizing

### Overlays
**Modals:**
- Centered, max-w-2xl
- Backdrop: backdrop-blur-sm with opacity-90
- Use for: Reward details, Achievement unlocks, Settings

**Toast Notifications:**
- Top-right position
- Types: Success (points earned), Info (new activity), Warning, Error
- Auto-dismiss after 5 seconds
- Include relevant icon

---

## Page Structures

### Dashboard Page
1. Stats Overview (4-column grid)
2. Quick Actions Bar (Connect accounts, View Rewards)
3. Activity Feeds (2-column: Twitter + SVM)
4. Points Progress Section
5. Recent Achievements

### Leaderboard Page
1. User's Current Rank Card (prominent)
2. Time Period Selector (Daily/Weekly/Monthly/All-time)
3. Top 10 Podium Display
4. Full Leaderboard Table

### Rewards Page
1. Available Points Display
2. Reward Tiers Grid (cards with: Image, Title, Points Required, Claim Button)
3. Redemption History Table

### Profile/Settings Page
1. User Info Card
2. Connected Accounts Section
3. Points Breakdown
4. Activity Statistics
5. Notification Preferences

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layouts
- Hamburger menu navigation
- Stacked activity feeds
- Simplified charts
- Bottom navigation bar for primary actions

**Tablet (768px - 1024px):**
- 2-column grids where appropriate
- Drawer navigation
- Side-by-side activity feeds

**Desktop (> 1024px):**
- Full sidebar navigation
- 3-4 column grids
- All features visible simultaneously

---

## Images

**No hero image required** - This is a data dashboard application.

**Icons:**
- Use Heroicons for UI elements
- Brand icons for Twitter, Solana
- Custom achievement badges (use placeholder comments for engineer)

**Avatars:**
- User profile images (Twitter integration)
- Default avatar fallback with initials

**Charts/Graphs:**
- Data visualizations generated by charting library
- No static images needed

---

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels for data visualizations
- Focus indicators with ring-2 ring-offset-2
- Color contrast ratio minimum 4.5:1 for text
- Screen reader announcements for point updates
- Reduced motion option respects prefers-reduced-motion

---

## Animations

**Minimal, Purposeful Only:**
- Points counter: Number increment animation when points earned
- New activity: Subtle slide-in for new items in feed
- Loading states: Skeleton screens, spinner for async operations
- Toast notifications: Slide-in from right
- Achievement unlock: Brief celebration modal with confetti effect (very occasional)

**No animations for:** Navigation transitions, hover states, scroll effects
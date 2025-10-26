# Motivodo Design Guidelines

## Design Approach
**Selected Approach:** Design System - Modern Productivity (Linear + Notion Inspired)

This productivity app requires clean, functional design that reduces cognitive load while maintaining visual appeal. Drawing inspiration from Linear's refined aesthetics and Notion's clarity, with Material Design principles for interactive feedback.

**Core Principles:**
- Functional minimalism: Every element serves a purpose
- Calm productivity: Subtle colors, generous whitespace
- Clear hierarchy: Typography and spacing guide user attention
- Delightful interactions: Micro-animations enhance UX without distraction

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN) - all UI elements
- Accent: Manrope (via Google Fonts CDN) - motivational quotes only

**Hierarchy:**
- App Title/Logo: Inter, 24px, font-bold (96)
- Page Headings: Inter, 32px, font-semibold (600)
- Section Headers: Inter, 20px, font-semibold (600)
- Task Titles: Inter, 16px, font-medium (500)
- Body Text: Inter, 14px, font-normal (400)
- Motivational Quote: Manrope, 18px, font-medium (500), italic
- Quote Author: Manrope, 14px, font-normal (400)
- Labels/Meta: Inter, 12px, font-medium (500), uppercase tracking-wide
- Buttons: Inter, 14px, font-medium (500)

---

## Layout System

**Spacing Primitives:**
Primary units: **2, 4, 6, 8, 12, 16** (Tailwind: p-2, p-4, p-6, p-8, p-12, p-16)

**Application Structure:**
- Max container width: max-w-7xl (1280px)
- Dashboard content area: max-w-5xl (1024px) centered
- Card max-width: max-w-2xl for quote card, full-width for task lists
- Sidebar width (if used): w-64 (256px)

**Responsive Breakpoints:**
- Mobile: Base styles
- Tablet: md: (768px)
- Desktop: lg: (1024px)

**Grid System:**
- Task cards: Single column on mobile, consider 2 columns on xl: for wide screens
- Feature sections (if applicable): grid-cols-1 md:grid-cols-3 for stats/metrics

---

## Component Library

### Navigation Bar
**Structure:** Sticky top, horizontal layout
- Height: h-16 (64px)
- Logo/brand left-aligned with app icon
- Navigation items center (Dashboard, Completed, Profile)
- User profile + theme toggle right-aligned
- Profile shows avatar (32px circle) + username
- Theme toggle as icon button with sun/moon icon

### Motivational Quote Card
**Design:** Prominent hero element below navigation
- Full-width container with max-w-5xl inner content
- Padding: p-8 md:p-12
- Quote text centered, large and italic
- Author attribution below, smaller, right-aligned with em-dash
- Refresh indicator (subtle) in corner
- Card style: rounded-2xl with subtle shadow

### Task Input Section
**Design:** Prominent, always accessible
- Sticky below quote card or at top of task list
- Large input field with placeholder "What needs to be done?"
- Expandable: Click to reveal description field + due date picker
- Add button: Primary, rounded-lg, positioned right
- Icon: Plus icon from Lucide

### Task List Container
**Layout:**
- Two distinct sections: "Active Tasks" and "Completed Tasks"
- Section headers with task count badge
- Separator line between sections
- Empty state illustrations with friendly copy

### Task Card
**Structure:** Individual task item
- Padding: p-4
- Checkbox left (24px, rounded)
- Task content middle: title (font-medium) + description (text-sm, muted)
- Metadata: Due date badge, priority indicator
- Action buttons right: Edit, Delete icons (appear on hover on desktop, always visible mobile)
- Border: Border-b for separation, no individual card borders
- Completed state: Strikethrough title, reduced opacity

**Priority Indicators:**
- High: Small red dot or badge
- Medium: Yellow/amber dot
- Low: Blue/gray dot
- Position: Next to task title

### Buttons
**Primary Button:**
- Padding: px-6 py-3
- Rounded: rounded-lg
- Font: font-medium
- Size: text-base
- Shadow: Subtle shadow, increases on hover

**Secondary/Ghost Button:**
- Padding: px-4 py-2
- Rounded: rounded-md
- Transparent background with border
- Hover: Subtle background fill

**Icon Buttons:**
- Size: w-10 h-10
- Rounded: rounded-md
- Hover: Background tint
- Icons: 20px from Lucide

### Form Elements
**Text Input:**
- Height: h-12
- Padding: px-4
- Border: 1px rounded-lg
- Focus: Ring effect, border accent
- Font-size: text-base

**Date Picker:**
- Compact calendar dropdown
- Triggered by calendar icon
- Shows formatted date when selected

**Checkbox (Task completion):**
- Size: 24px square
- Rounded: rounded-md
- Checked: Filled with checkmark
- Smooth transition on toggle

### Modal/Dialog
**Edit Task Modal:**
- Centered overlay with backdrop blur
- Max-width: max-w-lg
- Padding: p-8
- Rounded: rounded-2xl
- Close button top-right
- Form layout: Stacked inputs with consistent spacing (space-y-4)

### Progress Indicator
**Completion Meter:**
- Horizontal bar showing % of tasks completed
- Height: h-2
- Rounded: rounded-full
- Position: Above or below task sections
- Animated fill on change

### Toast Notifications
**Design:**
- Position: Fixed bottom-right on desktop, bottom center on mobile
- Max-width: max-w-sm
- Padding: p-4
- Rounded: rounded-lg
- Icon left: Success (check), Error (x)
- Auto-dismiss after 3 seconds
- Slide-in animation from bottom

---

## Animations & Interactions

**Use Framer Motion sparingly:**
- Task completion: Checkbox check animation + subtle fade/slide to completed section
- Task add: Fade-in and slide from top
- Modal: Fade backdrop + scale modal from 0.95 to 1
- Theme toggle: Smooth color transition (300ms)
- Quote refresh: Gentle fade cross-dissolve

**No hover animations on:**
- Images/cards as containers
- Large interactive areas

**Standard CSS transitions:**
- Button hover states: 150ms ease
- Input focus: 200ms ease
- Background color changes: 300ms ease

---

## Theme Implementation

**Light & Dark Mode Strategy:**
- Toggle stored in localStorage
- System preference detection on first visit
- Smooth transitions between modes (transition-colors duration-300)
- All components adapt semantically (not hardcoded colors)
- Use Tailwind's dark: modifier throughout

**Visual Treatment Notes:**
- Light mode: Soft backgrounds, clear contrast
- Dark mode: True dark (not gray), reduced eye strain
- Quote card: Elevated appearance in both modes
- Task cards: Subtle separation, not harsh borders

---

## Accessibility

- All interactive elements: min 44px touch target
- Form inputs: Proper labels and placeholders
- Focus indicators: Visible ring on all focusable elements
- Color contrast: WCAG AA compliant minimum
- Keyboard navigation: Tab order logical, Enter submits forms
- Screen reader: Semantic HTML, ARIA labels where needed
- Task status: Visual + text indication (not color alone)

---

## Icons

**Library:** Lucide Icons (via CDN)
**Usage:**
- Plus (task add)
- Edit/Pencil (edit task)
- Trash (delete task)
- Check (completed)
- Calendar (due date)
- Sun/Moon (theme toggle)
- User (profile)
- Refresh (quote reload)
- X (close/cancel)

**Sizing:** 20px standard, 24px for primary actions, 16px for metadata

---

## Images

**No hero image required** - The motivational quote card serves as the visual focal point.

**Profile Avatar:**
- User profile picture in navigation
- 32px circle, default to initials if no image
- Subtle border/shadow for definition

**Empty States:**
- Simple illustration or icon for "No tasks yet"
- Encouraging copy: "You're all caught up!" for completed tasks view
- Use Lucide icons scaled large (48-64px) as simple illustrations

---

## Special Considerations

**Dashboard Layout:**
1. Navigation bar (sticky)
2. Motivational quote card (prominent, refreshes daily)
3. Progress meter (task completion %)
4. Task input (sticky or prominent)
5. Active tasks section (scrollable)
6. Completed tasks section (collapsible or separate view)

**Mobile Optimizations:**
- Bottom navigation alternative for key sections
- Swipe gestures: Swipe task card to reveal delete
- Larger touch targets: 48px minimum
- Simplified quote card: Reduced padding
- Stack priority/date badges vertically on narrow screens

**Performance:**
- Lazy load completed tasks if list is long
- Virtualized scrolling for 100+ tasks
- Debounced search/filter inputs
- Optimistic UI updates (appear instant, sync background)
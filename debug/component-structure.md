# Component Structure Documentation

## Directory Layout
```
src/
├── app/
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Main page with all sections
│   └── globals.css         # Global styles and custom utilities
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Navigation header with mobile menu
│   │   └── Footer.tsx      # Footer with contact and social links
│   └── sections/
│       ├── HeroSection.tsx         # Landing hero section
│       ├── CountdownTimer.tsx      # Competition countdown timer
│       ├── CompetitionsOverview.tsx # Competition type cards
│       ├── TimelineSection.tsx     # Event timeline
│       ├── VlogChallenge.tsx       # Vlog challenge details
│       ├── GallerySection.tsx      # Filterable gallery
│       └── Testimonials.tsx        # Student testimonials
└── lib/ (preserved existing)
```

## Component Hierarchy
```
RootLayout
├── Header
├── Main Content
│   └── Home Page
│       ├── HeroSection
│       ├── CountdownTimer
│       ├── CompetitionsOverview
│       ├── TimelineSection
│       ├── VlogChallenge
│       ├── GallerySection
│       └── Testimonials
└── Footer
```

## Key Features by Component

### Header.tsx
- Sticky navigation with backdrop blur
- Mobile hamburger menu
- Logo with event branding
- Responsive navigation items

### HeroSection.tsx
- Full-screen hero with animated background
- Gradient text effects
- Call-to-action buttons
- Scroll indicator animation
- Floating animated shapes

### CountdownTimer.tsx
- Real-time countdown to competition
- Gradient time unit cards
- Responsive layout
- Auto-updating every second

### CompetitionsOverview.tsx
- Horizontal scrollable cards
- Hover effects and scaling
- Competition type icons
- Mobile scroll indicators

### TimelineSection.tsx
- Visual timeline with alternating layout
- Event type indicators (online/offline/event)
- Gradient timeline line
- Responsive card design

### VlogChallenge.tsx
- Tab-based grade level selection
- Requirements and prize information
- Production tips section
- Statistics display

### GallerySection.tsx
- Filterable gallery system
- Hover overlay effects
- Year badges and type indicators
- Statistics section

### Testimonials.tsx
- Auto-rotating testimonials
- Navigation dots
- Call-to-action section
- Fun statistics with emojis

### Footer.tsx
- Contact information
- Social media links
- Event description
- Copyright information

## Design System
- **Colors**: Orange, blue, purple, green gradients
- **Typography**: Poppins font family
- **Animations**: CSS transitions and transforms
- **Responsive**: Mobile-first approach
- **Interactive**: Hover effects and micro-interactions
# Troubleshooting Guide

## Common Issues and Solutions

### 1. Font Import Issues
**Problem**: Warning about @next/font package
**Solution**: 
- Remove `@next/font` dependency
- Use built-in `next/font/google` import
- Update font variable in globals.css

### 2. TailwindCSS v4 Configuration
**Problem**: Styles not applying correctly
**Solution**:
- Check `@import "tailwindcss"` in globals.css
- Verify PostCSS configuration uses `@tailwindcss/postcss`
- Theme configuration is inline in CSS with `@theme inline`

### 3. Component Import Errors
**Problem**: Module not found errors
**Solution**:
- Verify file paths in import statements
- Check file extensions (.tsx)
- Ensure proper export statements

### 4. Responsive Design Issues
**Problem**: Mobile layout broken
**Solution**:
- Check Tailwind responsive prefixes (sm:, md:, lg:)
- Verify container classes
- Test with browser dev tools

### 5. Animation Not Working
**Problem**: CSS animations not playing
**Solution**:
- Check custom CSS in globals.css
- Verify animation keyframes are defined
- Ensure proper class names applied

### 6. Build Errors
**Problem**: TypeScript compilation errors
**Solution**:
- Check type definitions
- Verify React component types
- Ensure proper import/export syntax

## Development Server Commands

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Linting
```bash
npm run lint
```

## Browser Testing Checklist

### Chrome/Edge
- [ ] Responsive design works
- [ ] Animations play smoothly
- [ ] Mobile menu functions
- [ ] Gallery filters work
- [ ] Countdown timer updates

### Safari
- [ ] Backdrop blur effects
- [ ] Font rendering
- [ ] Touch interactions
- [ ] Scroll behavior

### Mobile Devices
- [ ] Touch targets are large enough
- [ ] Horizontal scrolling works
- [ ] Text is readable
- [ ] Buttons are accessible

## Performance Optimization

### Image Optimization
- Use Next.js Image component for photos
- Implement lazy loading for gallery
- Optimize emoji rendering

### Bundle Size
- Code split by sections if needed
- Optimize font loading
- Minimize CSS custom properties

### Animation Performance
- Use CSS transforms instead of layout changes
- Implement will-change property sparingly
- Test on lower-end devices

## Environment Variables
Required for full functionality (preserved from original):
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# AI Integration (optional)
OPENAI_API_KEY
ANTHROPIC_API_KEY
```

## Debug Tools
- React Developer Tools
- Chrome DevTools
- Lighthouse for performance
- Network tab for resource loading
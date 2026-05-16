# 🚀 Quick Start Guide - BugFix AI Frontend

## Getting Started in 3 Steps

### 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

### 2️⃣ Start Development Server

```bash
npm run dev
```

### 3️⃣ Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Application Overview

### Main Features

#### 🏠 Home Page

- Welcome screen with feature overview
- Quick navigation to main features
- Key statistics display

#### 🔍 Investigate Page

**Repository Analysis:**

- Enter GitHub/GitLab repository URL
- Specify branch (optional)
- Click "Analyze Repository"

**Code Snippet Analysis:**

- Paste your code
- Select programming language
- Add filename (optional)
- Click "Analyze Code"

#### 🗺️ Heatmap Page

- Visual error distribution across files
- Color-coded severity (Green → Red)
- Click files for detailed information
- View error and warning counts

#### 📊 Analytics Page

- Time series analysis trends
- Error type distribution charts
- File type statistics
- Recent activity feed
- Performance insights

#### ⚙️ Settings Page

- General preferences
- Notification settings
- Appearance customization
- Code analysis configuration

---

## 🎨 UI Components

### Sidebar Navigation

- **Logo**: BugFix AI branding
- **Search**: Quick search (⌘ + F)
- **Main Nav**: Home, Investigate, Heatmap, Analytics, Settings
- **Other**: Documentation, Support
- **Boost AI**: Upgrade prompt
- **Profile**: User information

### Topbar

- **Page Title**: Current page name
- **Bob Status**: Connection indicator (green = connected)
- **User Avatar**: Profile access

---

## 🎯 Key Interactions

### Navigation

- Click sidebar items to navigate
- Active page highlighted with purple gradient
- Smooth page transitions with Framer Motion

### Forms

- Real-time validation
- Loading states during analysis
- Success/error notifications
- Auto-clear on successful submission

### Charts (Analytics)

- Interactive tooltips on hover
- Responsive to window resize
- Dark theme optimized colors

---

## 🎨 Design System

### Colors

- **Primary**: Purple-blue gradient (#6366f1)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Background**: Deep black (#0a0a0a)
- **Surface**: Charcoal (#1a1a1a)

### Animations

- Page transitions: Fade + slide
- Hover effects: Scale + color change
- Loading states: Spin + pulse
- All animations: 0.3s duration

---

## 🔧 Development Tips

### Hot Reload

Changes to files automatically reload the browser

### TypeScript

Full type safety with TypeScript

- Check `types/index.ts` for type definitions
- Use proper types for all components

### State Management

Global state managed with Zustand

- Access: `useAppStore()`
- Persisted: Analysis history
- Ephemeral: Connection status, current page

### Styling

Tailwind CSS utility classes

- Custom colors in `globals.css`
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Dark theme by default

---

## 📝 Common Tasks

### Add a New Page

1. Create `app/newpage/page.tsx`
2. Add to sidebar navigation in `components/layout/Sidebar.tsx`
3. Update page title in component with `setCurrentPage('New Page')`

### Add a New Component

1. Create in `components/ui/` or `components/features/`
2. Export from component file
3. Import where needed

### Update Theme Colors

Edit `app/globals.css`:

```css
:root {
  --primary: #your-color;
}
```

### Add API Endpoint

Edit `lib/api.ts`:

```typescript
export const api = {
  newEndpoint: async (data) => {
    const response = await apiClient.post("/endpoint", data);
    return response.data;
  },
};
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
npm run dev -- -p 3001
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Check TypeScript errors
npm run build
# Fix errors and rebuild
```

### Styling Issues

```bash
# Restart dev server
# Ctrl+C then npm run dev
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Dev server running
- [ ] Application opens in browser
- [ ] All pages accessible
- [ ] Navigation working
- [ ] Forms functional
- [ ] Charts rendering
- [ ] Animations smooth
- [ ] Responsive on mobile

---

## 🎉 You're Ready!

The application is now running and ready for development. Start by exploring the different pages and features. Happy coding! 🚀

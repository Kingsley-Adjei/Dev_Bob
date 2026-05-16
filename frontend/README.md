# BugFix AI - Frontend

A beautiful, modern Next.js 14 application for AI-powered code analysis and bug fixing.

## 🚀 Features

- **Repository Analysis**: Analyze entire Git repositories for bugs and errors
- **Code Snippet Analysis**: Paste code snippets for instant AI-powered fixes
- **Error Heatmap**: Visual representation of errors across your codebase
- **Analytics Dashboard**: Track code quality metrics and improvement trends
- **Dark Theme**: Professional dark-themed UI with purple-blue accents
- **Responsive Design**: Works seamlessly on all devices
- **Real-time Updates**: Live connection status and analysis progress

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **HTTP Client**: Axios

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with Sidebar & Topbar
│   ├── page.tsx             # Home page
│   ├── investigate/         # Code investigation page
│   ├── heatmap/             # Error heatmap visualization
│   ├── analytics/           # Analytics dashboard
│   └── settings/            # Settings page
├── components/
│   ├── layout/              # Layout components
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── Topbar.tsx       # Top navigation bar
│   ├── ui/                  # Reusable UI components
│   └── features/            # Feature-specific components
├── lib/
│   ├── utils.ts             # Utility functions
│   └── api.ts               # API client configuration
├── stores/
│   └── useAppStore.ts       # Zustand global state
├── types/
│   └── index.ts             # TypeScript type definitions
└── styles/
    └── globals.css          # Global styles & theme
```

## 🎨 Design System

### Color Palette

- **Background**: `#0a0a0a` (Deep black)
- **Surface**: `#1a1a1a` (Charcoal)
- **Surface Elevated**: `#2a2a2a` (Lighter charcoal)
- **Primary**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)

### Typography

- **Font Family**: Geist Sans (Primary), Geist Mono (Code)
- **Headings**: Bold, 24-48px
- **Body**: Regular, 14-16px
- **Small**: 12-14px

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📄 Available Pages

### Home (`/`)

- Welcome screen with feature overview
- Quick access to main features
- Statistics and insights

### Investigate (`/investigate`)

- Repository URL input for Git analysis
- Code snippet input with language selection
- Real-time analysis status

### Heatmap (`/heatmap`)

- Visual error distribution across files
- Color-coded severity indicators
- File-level error details

### Analytics (`/analytics`)

- Time series analysis trends
- Error type distribution
- File type statistics
- Recent activity feed

### Settings (`/settings`)

- General preferences
- Notification settings
- Appearance customization
- Code analysis configuration

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### API Integration

The application uses Axios for API calls. Configure the base URL in `lib/api.ts`:

```typescript
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 30000,
});
```

## 🎯 Key Components

### Sidebar

- Logo and branding
- Search functionality
- Main navigation (Home, Investigate, Heatmap, Analytics, Settings)
- Secondary navigation (Documentation, Support)
- AI upgrade prompt
- User profile

### Topbar

- Dynamic page title
- Bob connection status indicator
- User avatar

### State Management

Uses Zustand for global state:

- Connection status
- Current page
- Analysis history
- User preferences

## 🎨 Styling

### Tailwind CSS Classes

Custom utility classes defined in `globals.css`:

```css
.gradient-primary        /* Purple-blue gradient */
.gradient-primary-hover  /* Darker gradient on hover */
.animate-fade-in        /* Fade in animation */
.animate-slide-in       /* Slide in animation */
```

### Framer Motion Animations

All pages and components use Framer Motion for smooth transitions:

- Page transitions
- Hover effects
- Loading states
- Interactive elements

## 🔌 API Endpoints

The frontend expects the following API endpoints:

- `POST /api/analyze/repo` - Analyze Git repository
- `POST /api/analyze/snippet` - Analyze code snippet
- `GET /api/analysis/:id` - Get analysis results
- `GET /api/heatmap/:id` - Get heatmap data
- `GET /api/analytics` - Get analytics data

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🐛 Known Issues

- API integration requires backend server to be running
- Some TypeScript strict mode warnings (non-breaking)

## 🚀 Future Enhancements

- [ ] User authentication
- [ ] File upload support
- [ ] Real-time collaboration
- [ ] Code diff viewer
- [ ] Export analysis reports
- [ ] Custom themes
- [ ] Keyboard shortcuts

## 📝 License

This project is part of the BugFix AI application.

## 👥 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues or questions, please contact the development team.

---

Built with ❤️ using Next.js 14 and TypeScript

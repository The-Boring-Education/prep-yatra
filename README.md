# 🚀 Prep Yatra - Your Learning Journey Companion

A comprehensive platform designed to help learners track their preparation progress, manage recruiter contacts, and achieve their career goals through structured learning challenges and gamified experiences.

## ✨ Features

### 🎯 Core Learning Features
- **Daily Prep Logs**: Track your daily learning activities with time spent and descriptions
- **Learning Challenges**: Create and participate in structured learning challenges (21-day Python, Java, Internship prep, etc.)
- **Progress Tracking**: Visual progress indicators and milestone celebrations
- **Skills Management**: Organize and showcase your technical skills

### 🏆 Gamification System
- **Points & Badges**: Earn points for completing tasks and unlock achievements
- **Streak Tracking**: Maintain learning streaks for consistent progress
- **Celebration Animations**: Visual rewards for accomplishments
- **Leaderboards**: Compare progress with other learners

### 💼 Career Development
- **Recruiter Management**: Organize and track recruiter contacts
- **Interview Status Tracking**: Monitor application progress
- **Goal Setting**: Define and track career objectives
- **Company Targeting**: Focus on specific target companies

### 🔄 Social & Sharing
- **Journey Sharing**: Share your learning journey with others
- **Social Media Integration**: Generate shareable content for platforms
- **Community Features**: Connect with fellow learners
- **Resource Sharing**: Share valuable learning resources

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context + Custom Hooks
- **UI Components**: Modular, reusable component library

### Project Structure
```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── onboarding/     # Onboarding flow components
│   └── ...             # Feature-specific components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── pages/               # Next.js pages
├── services/            # API service layer
├── types/               # TypeScript type definitions
├── constants/           # Application constants
├── lib/                 # Utility functions
└── styles/              # Global styles
```

### Key Components
- **Dashboard**: Central hub for all learning activities
- **Challenge System**: Learning challenge management
- **Prep Logs**: Daily learning activity tracking
- **Recruiter Management**: Contact and application tracking
- **Gamification**: Points, badges, and achievements
- **Profile Management**: User profile and skills showcase

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prep-yatra
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TBE_WEBAPP_API_URL=your_api_url
   NEXT_PUBLIC_ONBOARDING_APP_URL=your_onboarding_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

### Component Development
- Use TypeScript interfaces for props
- Implement lazy loading for performance
- Follow the established component patterns
- Use shadcn/ui components for consistency

## 🔌 API Integration

### External API Services
The application integrates with external APIs for:
- User authentication and management
- Prep logs and statistics
- Recruiter contact management
- Challenge and gamification data

### Service Layer Pattern
All API calls are centralized through service files:
- `src/services/prep-logs.ts` - Learning activity management
- `src/services/recruiters.ts` - Recruiter contact management
- `src/services/prep-stats.ts` - Statistics and analytics

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Consistent color palette with dark/light mode support
- **Typography**: Clear hierarchy and readability
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first responsive design

### Key UI Components
- **Cards**: Information display and organization
- **Modals**: User input and confirmation dialogs
- **Tabs**: Content organization and navigation
- **Forms**: User input with validation
- **Progress Indicators**: Visual feedback for progress

## 🔐 Authentication & Security

### User Management
- Secure authentication flow
- Protected routes for authenticated users
- User profile management
- Onboarding flow for new users

### Data Privacy
- User data isolation
- Secure API communication
- Privacy-focused design

## 📱 Mobile Experience

### Progressive Web App (PWA)
- Install prompt for mobile devices
- Offline capability
- Responsive design for all screen sizes
- Touch-friendly interactions

### Mobile-Specific Features
- Swipe gestures
- Touch-optimized buttons
- Mobile-first navigation
- Optimized performance

## 🚧 Roadmap

### Upcoming Features
- [ ] **Advanced Challenge System**: More challenge types and templates
- [ ] **Community Features**: User interactions and discussions
- [ ] **Analytics Dashboard**: Detailed progress insights
- [ ] **Mobile App**: Native mobile applications
- [ ] **Integration APIs**: Third-party platform integrations

### Challenge System (In Development)
- [ ] Create custom learning challenges
- [ ] Pre-defined challenge templates
- [ ] Daily progress logging
- [ ] Social media sharing
- [ ] Gamification integration

## 🤝 Contributing

### Development Guidelines
1. Follow the established code patterns
2. Use TypeScript for all new code
3. Implement proper error handling
4. Add appropriate tests
5. Update documentation

### Pull Request Process
1. Create a feature branch
2. Implement your changes
3. Add tests if applicable
4. Update documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- Styling with Tailwind CSS
- Icons from Lucide React

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Prep Yatra** - Empowering learners to achieve their career goals through structured preparation and community support. 🎯✨

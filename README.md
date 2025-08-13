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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Analytics

- Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` to enable GA4 tracking.
- Events tracked include page views, clicks, form submissions, onboarding steps, skills add/remove, and prep log CRUD.

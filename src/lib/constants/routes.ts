// src/lib/constants/routes.ts
export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  
  // Authentication routes
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    CALLBACK: '/auth/callback'
  },
  
  // User dashboard routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Assessment routes
  ASSESSMENTS: {
    INDEX: '/assessments',
    START: '/assessments/start',
    TAKE: (sessionId: string) => `/assessments/take/${sessionId}`,
    RESULTS: (sessionId: string) => `/assessments/results/${sessionId}`,
    HISTORY: '/assessments/history',
    COMPARE: '/assessments/compare'
  },
  
  // Configuration routes (admin)
  ADMIN: {
    INDEX: '/admin',
    USERS: '/admin/users',
    CONFIGURATIONS: '/admin/configurations',
    TEST_TYPES: '/admin/test-types',
    QUESTIONS: '/admin/questions',
    ANALYTICS: '/admin/analytics',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings'
  },
  
  // API routes
  API: {
    AUTH: {
      SIGNIN: '/api/auth/signin',
      SIGNUP: '/api/auth/signup',
      SIGNOUT: '/api/auth/signout',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile'
    },
    ASSESSMENTS: {
      START: '/api/assessments/start',
      SUBMIT: '/api/assessments/submit',
      COMPLETE: '/api/assessments/complete',
      RESULTS: (sessionId: string) => `/api/assessments/results/${sessionId}`,
      HISTORY: '/api/assessments/history'
    },
    CONFIGURATIONS: '/api/configurations',
    TEST_TYPES: '/api/test-types',
    QUESTIONS: '/api/questions',
    USERS: '/api/users',
    ANALYTICS: '/api/analytics',
    REPORTS: '/api/reports'
  }
} as const

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
  ROUTES.ASSESSMENTS.INDEX,
  ROUTES.ASSESSMENTS.HISTORY,
  ...Object.values(ROUTES.ADMIN)
] as const

export const ADMIN_ROUTES = [
  ...Object.values(ROUTES.ADMIN)
] as const

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.PRIVACY,
  ROUTES.TERMS,
  ...Object.values(ROUTES.AUTH)
] as const

export const NAVIGATION_ITEMS = {
  MAIN: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'Home' },
    { label: 'Assessments', href: ROUTES.ASSESSMENTS.INDEX, icon: 'FileText' },
    { label: 'History', href: ROUTES.ASSESSMENTS.HISTORY, icon: 'Clock' },
    { label: 'Profile', href: ROUTES.PROFILE, icon: 'User' }
  ],
  ADMIN: [
    { label: 'Overview', href: ROUTES.ADMIN.INDEX, icon: 'BarChart' },
    { label: 'Users', href: ROUTES.ADMIN.USERS, icon: 'Users' },
    { label: 'Configurations', href: ROUTES.ADMIN.CONFIGURATIONS, icon: 'Settings' },
    { label: 'Test Types', href: ROUTES.ADMIN.TEST_TYPES, icon: 'FileText' },
    { label: 'Questions', href: ROUTES.ADMIN.QUESTIONS, icon: 'HelpCircle' },
    { label: 'Analytics', href: ROUTES.ADMIN.ANALYTICS, icon: 'TrendingUp' },
    { label: 'Reports', href: ROUTES.ADMIN.REPORTS, icon: 'Download' }
  ],
  FOOTER: [
    { label: 'About', href: ROUTES.ABOUT },
    { label: 'Contact', href: ROUTES.CONTACT },
    { label: 'Privacy Policy', href: ROUTES.PRIVACY },
    { label: 'Terms of Service', href: ROUTES.TERMS }
  ]
} as const

export const BREADCRUMB_CONFIGS = {
  [ROUTES.DASHBOARD]: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD }
  ],
  [ROUTES.ASSESSMENTS.INDEX]: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD },
    { label: 'Assessments', href: ROUTES.ASSESSMENTS.INDEX }
  ],
  [ROUTES.ASSESSMENTS.HISTORY]: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD },
    { label: 'Assessments', href: ROUTES.ASSESSMENTS.INDEX },
    { label: 'History', href: ROUTES.ASSESSMENTS.HISTORY }
  ],
  [ROUTES.PROFILE]: [
    { label: 'Dashboard', href: ROUTES.DASHBOARD },
    { label: 'Profile', href: ROUTES.PROFILE }
  ]
} as const
#!/bin/bash

# Psychometric Assessment Platform - Directory Structure Generator
# Date: 2025-06-24 06:52:50 UTC
# User: venev-g

echo "🚀 Creating Psychometric Assessment Platform Directory Structure..."
echo "📅 Date: $(date)"
echo "👤 User: $USER"
echo "📂 Current Directory: $(pwd)"
echo ""

# Function to create directories
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo "✅ Created directory: $1"
    else
        echo "⚠️  Directory already exists: $1"
    fi
}

# Function to create empty files
create_file() {
    local file_path="$1"
    local dir_path=$(dirname "$file_path")
    
    # Create directory if it doesn't exist
    create_dir "$dir_path"
    
    if [ ! -f "$file_path" ]; then
        touch "$file_path"
        echo "✅ Created file: $file_path"
    else
        echo "⚠️  File already exists: $file_path"
    fi
}

echo "📁 Creating root configuration files..."

# Root configuration files
create_file ".env.example"
create_file ".gitignore"
create_file ".eslintrc.json"
create_file "next.config.js"
create_file "tsconfig.json"
create_file "tailwind.config.js"
create_file "jest.config.js"
create_file "jest.setup.js"
create_file "Dockerfile"
create_file "docker-compose.yml"
create_file "README.md"
create_file "middleware.ts"

echo ""
echo "📁 Creating public directory and assets..."

# Public directory
create_dir "public/images/assessment-icons"
create_file "public/favicon.ico"
create_file "public/manifest.json"
create_file "public/images/logo.png"
create_file "public/images/hero-bg.jpg"
create_file "public/images/assessment-icons/intelligence.svg"
create_file "public/images/assessment-icons/personality.svg"
create_file "public/images/assessment-icons/vark.svg"

echo ""
echo "📁 Creating Supabase configuration..."

# Supabase directory
create_dir "supabase/migrations"
create_dir "supabase/functions"
create_file "supabase/config.toml"
create_file "supabase/migrations/001_initial_schema.sql"
create_file "supabase/migrations/002_seed_data.sql"
create_file "supabase/migrations/003_questions_data.sql"
create_file "supabase/migrations/004_rls_policies.sql"
create_file "supabase/seed.sql"

echo ""
echo "📁 Creating src directory structure..."

# Main source directories
create_dir "src/app"
create_dir "src/components"
create_dir "src/lib"
create_dir "src/types"

echo ""
echo "📁 Creating App Router API structure..."

# API routes
create_dir "src/app/api/auth/signup"
create_dir "src/app/api/auth/signin"
create_dir "src/app/api/auth/signout"
create_dir "src/app/api/assessments/start"
create_dir "src/app/api/assessments/sessions"
create_dir "src/app/api/assessments/session/[sessionId]/current"
create_dir "src/app/api/assessments/session/[sessionId]/response"
create_dir "src/app/api/assessments/session/[sessionId]/complete-test"
create_dir "src/app/api/assessments/session/[sessionId]/results"
create_dir "src/app/api/assessments/session/[sessionId]/progress"
create_dir "src/app/api/configurations"
create_dir "src/app/api/configurations/[configId]"
create_dir "src/app/api/configurations/sequences"
create_dir "src/app/api/test-types"
create_dir "src/app/api/questions"
create_dir "src/app/api/questions/[questionId]"

# API route files
create_file "src/app/api/auth/signup/route.ts"
create_file "src/app/api/auth/signin/route.ts"
create_file "src/app/api/auth/signout/route.ts"
create_file "src/app/api/assessments/start/route.ts"
create_file "src/app/api/assessments/sessions/route.ts"
create_file "src/app/api/assessments/session/[sessionId]/current/route.ts"
create_file "src/app/api/assessments/session/[sessionId]/response/route.ts"
create_file "src/app/api/assessments/session/[sessionId]/complete-test/route.ts"
create_file "src/app/api/assessments/session/[sessionId]/results/route.ts"
create_file "src/app/api/assessments/session/[sessionId]/progress/route.ts"
create_file "src/app/api/configurations/route.ts"
create_file "src/app/api/configurations/[configId]/route.ts"
create_file "src/app/api/configurations/sequences/route.ts"
create_file "src/app/api/test-types/route.ts"
create_file "src/app/api/questions/route.ts"
create_file "src/app/api/questions/[questionId]/route.ts"

echo ""
echo "📁 Creating App Router pages structure..."

# Page directories
create_dir "src/app/auth/login"
create_dir "src/app/auth/signup"
create_dir "src/app/auth/forgot-password"
create_dir "src/app/auth/reset-password"
create_dir "src/app/dashboard"
create_dir "src/app/assessment/[sessionId]"
create_dir "src/app/assessment/start"
create_dir "src/app/results/[sessionId]"
create_dir "src/app/results/history"
create_dir "src/app/admin"
create_dir "src/app/admin/configurations"
create_dir "src/app/admin/configurations/[id]"
create_dir "src/app/admin/configurations/new"
create_dir "src/app/admin/test-types"
create_dir "src/app/admin/test-types/[id]"
create_dir "src/app/admin/test-types/new"
create_dir "src/app/admin/questions"
create_dir "src/app/admin/questions/[id]"
create_dir "src/app/admin/questions/new"
create_dir "src/app/admin/users"
create_dir "src/app/admin/analytics"
create_dir "src/app/profile"
create_dir "src/app/profile/settings"

# Main app files
create_file "src/app/layout.tsx"
create_file "src/app/page.tsx"
create_file "src/app/loading.tsx"
create_file "src/app/error.tsx"
create_file "src/app/not-found.tsx"
create_file "src/app/globals.css"

# Auth pages
create_file "src/app/auth/login/page.tsx"
create_file "src/app/auth/signup/page.tsx"
create_file "src/app/auth/forgot-password/page.tsx"
create_file "src/app/auth/reset-password/page.tsx"

# Dashboard pages
create_file "src/app/dashboard/page.tsx"
create_file "src/app/dashboard/loading.tsx"
create_file "src/app/dashboard/layout.tsx"

# Assessment pages
create_file "src/app/assessment/[sessionId]/page.tsx"
create_file "src/app/assessment/[sessionId]/loading.tsx"
create_file "src/app/assessment/[sessionId]/error.tsx"
create_file "src/app/assessment/start/page.tsx"

# Results pages
create_file "src/app/results/[sessionId]/page.tsx"
create_file "src/app/results/[sessionId]/loading.tsx"
create_file "src/app/results/[sessionId]/error.tsx"
create_file "src/app/results/history/page.tsx"

# Admin pages
create_file "src/app/admin/page.tsx"
create_file "src/app/admin/layout.tsx"
create_file "src/app/admin/loading.tsx"
create_file "src/app/admin/configurations/page.tsx"
create_file "src/app/admin/configurations/[id]/page.tsx"
create_file "src/app/admin/configurations/new/page.tsx"
create_file "src/app/admin/test-types/page.tsx"
create_file "src/app/admin/test-types/[id]/page.tsx"
create_file "src/app/admin/test-types/new/page.tsx"
create_file "src/app/admin/questions/page.tsx"
create_file "src/app/admin/questions/[id]/page.tsx"
create_file "src/app/admin/questions/new/page.tsx"
create_file "src/app/admin/users/page.tsx"
create_file "src/app/admin/analytics/page.tsx"

# Profile pages
create_file "src/app/profile/page.tsx"
create_file "src/app/profile/settings/page.tsx"

echo ""
echo "📁 Creating components structure..."

# Components directories
create_dir "src/components/ui"
create_dir "src/components/layout"
create_dir "src/components/assessment"
create_dir "src/components/assessment/QuestionTypes"
create_dir "src/components/assessment/ResultsCharts"
create_dir "src/components/dashboard"
create_dir "src/components/admin"
create_dir "src/components/auth"
create_dir "src/components/common"

# UI Components
create_file "src/components/ui/Button.tsx"
create_file "src/components/ui/Card.tsx"
create_file "src/components/ui/Progress.tsx"
create_file "src/components/ui/Input.tsx"
create_file "src/components/ui/Label.tsx"
create_file "src/components/ui/Select.tsx"
create_file "src/components/ui/Textarea.tsx"
create_file "src/components/ui/Dialog.tsx"
create_file "src/components/ui/Tabs.tsx"
create_file "src/components/ui/Badge.tsx"
create_file "src/components/ui/Avatar.tsx"
create_file "src/components/ui/Skeleton.tsx"
create_file "src/components/ui/Alert.tsx"
create_file "src/components/ui/Toast.tsx"
create_file "src/components/ui/index.ts"

# Layout Components
create_file "src/components/layout/Header.tsx"
create_file "src/components/layout/Footer.tsx"
create_file "src/components/layout/Sidebar.tsx"
create_file "src/components/layout/Navigation.tsx"
create_file "src/components/layout/AuthGuard.tsx"

# Assessment Components
create_file "src/components/assessment/AssessmentFlow.tsx"
create_file "src/components/assessment/TestQuestion.tsx"
create_file "src/components/assessment/QuestionTypes/MultipleChoice.tsx"
create_file "src/components/assessment/QuestionTypes/RatingScale.tsx"
create_file "src/components/assessment/QuestionTypes/YesNo.tsx"
create_file "src/components/assessment/QuestionTypes/Multiselect.tsx"
create_file "src/components/assessment/ProgressTracker.tsx"
create_file "src/components/assessment/TestInstructions.tsx"
create_file "src/components/assessment/NavigationControls.tsx"
create_file "src/components/assessment/ResultsDisplay.tsx"
create_file "src/components/assessment/ResultsCharts/IntelligenceChart.tsx"
create_file "src/components/assessment/ResultsCharts/PersonalityChart.tsx"
create_file "src/components/assessment/ResultsCharts/VarkChart.tsx"
create_file "src/components/assessment/RecommendationsPanel.tsx"

# Dashboard Components
create_file "src/components/dashboard/DashboardOverview.tsx"
create_file "src/components/dashboard/StatsCards.tsx"
create_file "src/components/dashboard/RecentAssessments.tsx"
create_file "src/components/dashboard/QuickActions.tsx"
create_file "src/components/dashboard/ProgressSummary.tsx"

# Admin Components
create_file "src/components/admin/ConfigurationManager.tsx"
create_file "src/components/admin/TestTypeManager.tsx"
create_file "src/components/admin/QuestionManager.tsx"
create_file "src/components/admin/UserManager.tsx"
create_file "src/components/admin/AnalyticsDashboard.tsx"
create_file "src/components/admin/ConfigurationForm.tsx"
create_file "src/components/admin/TestTypeForm.tsx"
create_file "src/components/admin/QuestionForm.tsx"
create_file "src/components/admin/TestSequenceBuilder.tsx"

# Auth Components
create_file "src/components/auth/LoginForm.tsx"
create_file "src/components/auth/SignupForm.tsx"
create_file "src/components/auth/ForgotPasswordForm.tsx"
create_file "src/components/auth/ResetPasswordForm.tsx"
create_file "src/components/auth/AuthProvider.tsx"

# Common Components
create_file "src/components/common/LoadingSpinner.tsx"
create_file "src/components/common/ErrorBoundary.tsx"
create_file "src/components/common/ConfirmDialog.tsx"
create_file "src/components/common/DataTable.tsx"
create_file "src/components/common/Pagination.tsx"
create_file "src/components/common/SearchBar.tsx"
create_file "src/components/common/DatePicker.tsx"
create_file "src/components/common/FileUpload.tsx"

echo ""
echo "📁 Creating lib directory structure..."

# Lib directories
create_dir "src/lib/supabase"
create_dir "src/lib/assessments"
create_dir "src/lib/assessments/scoring"
create_dir "src/lib/services"
create_dir "src/lib/monitoring"
create_dir "src/lib/validations"
create_dir "src/lib/constants"
create_dir "src/lib/hooks"

# Supabase files
create_file "src/lib/supabase/client.ts"
create_file "src/lib/supabase/server.ts"
create_file "src/lib/supabase/middleware.ts"
create_file "src/lib/supabase/types.ts"

# Assessment files
create_file "src/lib/assessments/BaseAssessment.ts"
create_file "src/lib/assessments/AssessmentFactory.ts"
create_file "src/lib/assessments/DominantIntelligenceAssessment.ts"
create_file "src/lib/assessments/PersonalityPatternAssessment.ts"
create_file "src/lib/assessments/VarkAssessment.ts"
create_file "src/lib/assessments/scoring/ScoreCalculator.ts"
create_file "src/lib/assessments/scoring/NormalizationEngine.ts"
create_file "src/lib/assessments/scoring/RecommendationEngine.ts"

# Services files
create_file "src/lib/services/AssessmentOrchestrator.ts"
create_file "src/lib/services/ConfigurationService.ts"
create_file "src/lib/services/UserService.ts"
create_file "src/lib/services/AnalyticsService.ts"
create_file "src/lib/services/NotificationService.ts"
create_file "src/lib/services/ReportService.ts"

# Monitoring files
create_file "src/lib/monitoring/performance.ts"
create_file "src/lib/monitoring/analytics.ts"
create_file "src/lib/monitoring/errorTracking.ts"
create_file "src/lib/monitoring/logger.ts"

# Validation files
create_file "src/lib/validations/auth.ts"
create_file "src/lib/validations/assessment.ts"
create_file "src/lib/validations/configuration.ts"
create_file "src/lib/validations/user.ts"

# Constants files
create_file "src/lib/constants/routes.ts"
create_file "src/lib/constants/assessmentTypes.ts"
create_file "src/lib/constants/questionTypes.ts"
create_file "src/lib/constants/errorMessages.ts"

# Hooks files
create_file "src/lib/hooks/useAuth.ts"
create_file "src/lib/hooks/useAssessment.ts"
create_file "src/lib/hooks/useLocalStorage.ts"
create_file "src/lib/hooks/useDebounce.ts"
create_file "src/lib/hooks/usePerformance.ts"

# Main lib files
create_file "src/lib/utils.ts"
create_file "src/lib/errors.ts"
create_file "src/lib/auth-helpers.ts"

echo ""
echo "📁 Creating types directory structure..."

# Types files
create_file "src/types/database.types.ts"
create_file "src/types/assessment.types.ts"
create_file "src/types/user.types.ts"
create_file "src/types/api.types.ts"
create_file "src/types/chart.types.ts"
create_file "src/types/global.types.ts"

echo ""
echo "📁 Creating tests directory structure..."

# Tests directories
create_dir "tests/__mocks__"
create_dir "tests/components/ui"
create_dir "tests/components/assessment"
create_dir "tests/components/dashboard"
create_dir "tests/lib/assessments"
create_dir "tests/lib/services"
create_dir "tests/api/auth"
create_dir "tests/api/assessments"
create_dir "tests/api/configurations"
create_dir "tests/e2e"
create_dir "tests/fixtures"

# Mock files
create_file "tests/__mocks__/supabase.ts"
create_file "tests/__mocks__/next-router.ts"
create_file "tests/__mocks__/intersectionObserver.ts"

# Component tests
create_file "tests/components/ui/Button.test.tsx"
create_file "tests/components/ui/Card.test.tsx"
create_file "tests/components/ui/Progress.test.tsx"
create_file "tests/components/assessment/AssessmentFlow.test.tsx"
create_file "tests/components/assessment/TestQuestion.test.tsx"
create_file "tests/components/assessment/ResultsDisplay.test.tsx"
create_file "tests/components/dashboard/DashboardOverview.test.tsx"

# Library tests
create_file "tests/lib/assessments/BaseAssessment.test.ts"
create_file "tests/lib/assessments/DominantIntelligenceAssessment.test.ts"
create_file "tests/lib/assessments/PersonalityPatternAssessment.test.ts"
create_file "tests/lib/assessments/VarkAssessment.test.ts"
create_file "tests/lib/services/AssessmentOrchestrator.test.ts"
create_file "tests/lib/services/ConfigurationService.test.ts"
create_file "tests/lib/utils.test.ts"

# API tests
create_file "tests/api/auth/signup.test.ts"
create_file "tests/api/assessments/start.test.ts"
create_file "tests/api/configurations/route.test.ts"

# E2E tests
create_file "tests/e2e/auth.spec.ts"
create_file "tests/e2e/assessment-flow.spec.ts"
create_file "tests/e2e/admin-panel.spec.ts"
create_file "tests/e2e/results-viewing.spec.ts"

# Test fixtures
create_file "tests/fixtures/users.json"
create_file "tests/fixtures/assessments.json"
create_file "tests/fixtures/questions.json"
create_file "tests/fixtures/responses.json"

echo ""
echo "📁 Creating documentation directory..."

# Documentation
create_dir "docs/architecture"
create_file "docs/README.md"
create_file "docs/DEPLOYMENT.md"
create_file "docs/API_REFERENCE.md"
create_file "docs/CONTRIBUTING.md"
create_file "docs/ASSESSMENT_GUIDE.md"
create_file "docs/ADMIN_GUIDE.md"
create_file "docs/architecture/database-schema.md"
create_file "docs/architecture/api-design.md"
create_file "docs/architecture/security.md"
create_file "docs/architecture/performance.md"

echo ""
echo "📁 Creating scripts directory..."

# Scripts
create_file "scripts/build.sh"
create_file "scripts/deploy.sh"
create_file "scripts/seed-database.ts"
create_file "scripts/migrate-database.ts"
create_file "scripts/backup-database.ts"
create_file "scripts/generate-types.ts"

echo ""
echo "📁 Creating GitHub workflows..."

# GitHub workflows
create_dir ".github/workflows"
create_dir ".github/ISSUE_TEMPLATE"
create_file ".github/workflows/ci.yml"
create_file ".github/workflows/cd.yml"
create_file ".github/workflows/test.yml"
create_file ".github/workflows/deploy.yml"
create_file ".github/ISSUE_TEMPLATE/bug_report.md"
create_file ".github/ISSUE_TEMPLATE/feature_request.md"
create_file ".github/ISSUE_TEMPLATE/question.md"
create_file ".github/pull_request_template.md"

echo ""
echo "🎉 Directory structure creation completed!"
echo ""
echo "📊 Summary:"
echo "📁 Total directories created: $(find . -type d | wc -l)"
echo "📄 Total files created: $(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.sql" -o -name "*.yml" -o -name "*.toml" -o -name "*.css" -o -name "*.sh" | wc -l)"
echo ""
echo "✅ Project structure is ready for implementation!"
echo "🚀 Next steps:"
echo "   1. Run: npm init -y"
echo "   2. Install dependencies"
echo "   3. Copy/paste the code into respective files"
echo "   4. Set up Supabase project"
echo "   5. Configure environment variables"
echo ""
echo "Happy coding! 🎯"
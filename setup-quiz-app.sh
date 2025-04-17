#!/bin/bash

# Create main directories
mkdir -p src/components/layout
mkdir -p src/components/quiz
mkdir -p src/contexts
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/theme
mkdir -p src/pages

# Create layout components
touch src/components/layout/AppHeader.tsx
touch src/components/layout/Sidebar.tsx
touch src/components/layout/Footer.tsx

# Create quiz components
touch src/components/quiz/CourseSelection.tsx
touch src/components/quiz/QuizSettings.tsx
touch src/components/quiz/QuestionCard.tsx
touch src/components/quiz/Timer.tsx
touch src/components/quiz/ProgressBar.tsx
touch src/components/quiz/ResultSummary.tsx

# Create context files
touch src/contexts/QuizContext.tsx
touch src/contexts/AuthContext.tsx

# Create hooks
touch src/hooks/useTimer.ts
touch src/hooks/useLocalStorage.ts

# Create services
touch src/services/quizService.ts
touch src/services/storageService.ts

# Create utils
touch src/utils/formatters.ts
touch src/utils/validators.ts

# Create theme
touch src/theme/themes.css

# Create pages
touch src/pages/Home.tsx
touch src/pages/Quiz.tsx
touch src/pages/Results.tsx
touch src/pages/CourseManagement.tsx

# Create root files (if they don't exist)
touch src/App.tsx
touch src/index.css

echo "Application structure created successfully!"

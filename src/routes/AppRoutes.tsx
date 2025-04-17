import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from '@/pages/Home';
import CourseManagement from '@/pages/CourseManagement';
import Quiz from '@/pages/Quiz';
import HistoryPage from '@/pages/HistoryPage';
import TestQuestionBank from '@/pages/TestQuestionBank';
import Settings from '@/pages/Settings';

/**
 * Application routes component that defines all the routes
 * available in the application.
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course/:courseId" element={<CourseManagement />} />
      <Route path="/quiz/:courseId" element={<Quiz />} />
      <Route path="/history" element={<HistoryPage />} />
      {/* Redirect /results to history for backward compatibility */}
      <Route path="/results" element={<Navigate to="/history" replace />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/test-questions" element={<TestQuestionBank />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
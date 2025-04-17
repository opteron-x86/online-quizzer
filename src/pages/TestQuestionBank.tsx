import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { questionDataService } from '../services/questionDataService';
import QuestionCard, { Question } from '../components/quiz/QuestionCard';

const TestQuestionBank: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('D426');

  const availableCourses = [
    { id: 'D426', name: 'Data Management' }
    // Add more courses as they become available
  ];

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedQuestions = await questionDataService.getQuestionsForCourse(selectedCourse);
      setQuestions(loadedQuestions);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(`Failed to load questions. Make sure the JSON file is properly located at public/data/${selectedCourse}/d426_question_bank.json`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    
    if (showFeedback) {
      // Wait for a moment to let the user see the feedback before moving to next question
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleFeedback = () => {
    setShowFeedback(prev => !prev);
  };

  const handleCourseChange = (event: SelectChangeEvent) => {
    setSelectedCourse(event.target.value);
    setQuestions([]);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Question Bank Tester
      </Typography>
      
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 3 }}>
        Test loading and displaying questions from the selected question bank
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="course-select-label">Select Course</InputLabel>
        <Select
          labelId="course-select-label"
          value={selectedCourse}
          label="Select Course"
          onChange={handleCourseChange}
        >
          {availableCourses.map(course => (
            <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          onClick={loadQuestions}
          disabled={loading}
        >
          Load Questions
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={toggleFeedback}
          disabled={loading || questions.length === 0}
        >
          {showFeedback ? 'Hide Feedback' : 'Show Feedback'}
        </Button>
      </Box>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {!loading && questions.length > 0 && currentQuestion && (
        <>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Question Stats:
            </Typography>
            <Typography variant="body2">
              Course: {selectedCourse}
            </Typography>
            <Typography variant="body2">
              Loaded {questions.length} questions
            </Typography>
            <Typography variant="body2">
              Current Question: {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body2">
            Questions with images: {questions.filter(q => (q.imageUrls?.length ?? 0) > 0).length}
            </Typography>
          </Paper>
          
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={userAnswers[currentQuestion.id] || null}
            onAnswerSelect={handleAnswerSelect}
            showFeedback={showFeedback && userAnswers[currentQuestion.id] !== undefined}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
          />
        </>
      )}
      
      {!loading && questions.length === 0 && !error && (
        <Alert severity="info">
          Click "Load Questions" to test the question bank integration.
        </Alert>
      )}
    </Box>
  );
};

export default TestQuestionBank;
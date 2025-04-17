import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  // Paper,
  CircularProgress,
  Alert,
  // useTheme
} from '@mui/material';
import {
  ExitToApp as ExitIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// Import components
import QuestionCard from '@/components/quiz/QuestionCard';
import ProgressBar from '@/components/quiz/ProgressBar';
import Timer from '@/components/quiz/Timer';
import ResultSummary from '@/components/quiz/ResultSummary';

// Import context
import { useQuiz } from '@/contexts/QuizContext';

const Quiz = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  
  // Use the quiz context
  const { 
    quizState, 
    isLoading, 
    error, 
    selectCourse,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    submitQuiz,
    resetQuiz
  } = useQuiz();
  
  // Local state for dialogs
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  
  // Effect to select the course if needed
  useEffect(() => {
    if (courseId && !quizState.courseId) {
      selectCourse(courseId);
    }
  }, [courseId, quizState.courseId, selectCourse]);

  // Effect to auto-submit when timer expires
  useEffect(() => {
    if (timerExpired && !quizState.isComplete) {
      submitQuiz();
    }
  }, [timerExpired, quizState.isComplete, submitQuiz]);

  // Timer end handler
  const handleTimeEnd = () => {
    setTimerExpired(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    answerQuestion(questionId, answerId);
  };

  // Exit quiz handler
  const handleExitQuiz = () => {
    if (courseId) {
      resetQuiz();
      navigate(`/course/${courseId}`);
    } else {
      navigate('/');
    }
  };

  // Restart quiz handler
  const handleRestartQuiz = () => {
    if (courseId) {
      resetQuiz();
      navigate(`/course/${courseId}`);
    }
  };

  // Navigate to home
  const handleGoHome = () => {
    resetQuiz();
    navigate('/');
  };

  // Get currently answered questions
  const answeredQuestions = Object.keys(quizState.userAnswers).map(id => {
    const index = quizState.questions.findIndex(q => q.id === id);
    return index;
  });

  // Calculate time taken (for completed quizzes)
  const calculateTimeTaken = () => {
    if (quizState.startTime && quizState.endTime) {
      return Math.floor((quizState.endTime - quizState.startTime) / 1000);
    }
    return 0;
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/course/${courseId}`)}
          sx={{ mt: 2 }}
        >
          Back to Course
        </Button>
      </Container>
    );
  }

  // Check if quiz is properly initialized
  if (!quizState.settings || quizState.questions.length === 0) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 4 }}>
          Quiz has not been properly configured. Please go back and configure the quiz.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/course/${courseId}`)}
          sx={{ mt: 2 }}
        >
          Configure Quiz
        </Button>
      </Container>
    );
  }

  // Show results if quiz is complete
  if (quizState.isComplete && quizState.score !== null) {
    return (
      <Container maxWidth="lg">
        <ResultSummary 
          score={quizState.score}
          totalQuestions={quizState.questions.length}
          timeTaken={calculateTimeTaken()}
          questions={quizState.questions}
          userAnswers={quizState.userAnswers}
          onRestart={handleRestartQuiz}
          onReview={() => {/* Would implement review functionality */}}
          onHome={handleGoHome}
        />
      </Container>
    );
  }

  // Get current question
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  return (
    <Container maxWidth="lg">
      {/* Quiz header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2
        }}>
          <Typography variant="h5" component="h1">
            {courseId}: Quiz
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {quizState.settings.timeLimit > 0 && (
              <Timer 
                initialSeconds={quizState.settings.timeLimit * 60}
                onTimeEnd={handleTimeEnd}
                isActive={true}
                isCountDown={true}
              />
            )}
            
            <Button 
              variant="outlined" 
              color="inherit"
              startIcon={<ExitIcon />}
              onClick={() => setExitDialogOpen(true)}
            >
              Exit Quiz
            </Button>
          </Box>
        </Box>
        
        <ProgressBar 
          currentQuestion={quizState.currentQuestionIndex}
          totalQuestions={quizState.questions.length}
          answeredQuestions={answeredQuestions}
        />
      </Box>
      
      {/* Question card */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentIndex={quizState.currentQuestionIndex}
          totalQuestions={quizState.questions.length}
          selectedAnswer={quizState.userAnswers[currentQuestion.id] || null}
          onAnswerSelect={handleAnswerSelect}
          showFeedback={quizState.settings.showFeedback && !!quizState.userAnswers[currentQuestion.id]}
          onNextQuestion={goToNextQuestion}
          onPrevQuestion={goToPreviousQuestion}
        />
      )}
      
      {/* Submit button */}
      {Object.keys(quizState.userAnswers).length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CheckIcon />}
            onClick={() => setSubmitDialogOpen(true)}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem'
            }}
          >
            Submit Quiz
          </Button>
        </Box>
      )}
      
      {/* Exit confirmation dialog */}
      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
      >
        <DialogTitle>Exit Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to exit the quiz? Your progress will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExitDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExitQuiz} color="primary" variant="contained">
            Exit Quiz
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Submit confirmation dialog */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
      >
        <DialogTitle>Submit Quiz?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have answered {Object.keys(quizState.userAnswers).length} out of {quizState.questions.length} questions.
            {Object.keys(quizState.userAnswers).length < quizState.questions.length && (
              <strong> There are {quizState.questions.length - Object.keys(quizState.userAnswers).length} unanswered questions.</strong>
            )}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Are you sure you want to submit your quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitQuiz} color="primary" variant="contained">
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Quiz;
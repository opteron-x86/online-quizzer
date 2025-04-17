/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  PlayArrow as RetryIcon,
  RestartAlt as RestartIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { formatDate, formatDateTime, formatDuration } from '../utils/formatters';
import { quizService } from '../services/quizService';
import { Question } from '../components/quiz/QuestionCard';
import { QuizSettingsData } from '../contexts/QuizContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AttemptDetails {
  id: string;
  courseId: string;
  courseTitle: string;
  date: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  settings: QuizSettingsData;
  questionBankId?: string | null;
  questionBankName?: string;
}

// Define the expected structure from quiz service
interface QuizAttempt {
  id: string;
  courseId: string;
  settings: QuizSettingsData;
  questions: Question[];
  userAnswers: Record<string, string>;
  startTime: number;
  endTime: number;
  score: number;
  percentage?: number;
  questionCount?: number;
  questionBankId?: string | null;
  questionBankName?: string;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const HistoryPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AttemptDetails[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load quiz history from local storage
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const quizHistory = await quizService.getQuizHistory();
        
        // Convert the history data to our expected format
        const formattedHistory: AttemptDetails[] = quizHistory.map((item: QuizAttempt) => ({
          id: item.id,
          courseId: item.courseId,
          courseTitle: getCourseTitle(item.courseId),
          date: item.startTime,
          score: item.score,
          totalQuestions: item.questions.length,
          percentage: (item.score / item.questions.length) * 100,
          timeTaken: item.endTime - item.startTime,
          questions: item.questions,
          userAnswers: item.userAnswers,
          settings: item.settings,
          questionBankId: item.questionBankId,
          questionBankName: item.questionBankName || "Practice Quiz"
        }));
    
        setHistory(formattedHistory);
        setError(null);
      } catch (err) {
        console.error('Error loading history:', err);
        setError('Failed to load quiz history');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Helper function to get course title from course ID
  const getCourseTitle = (courseId: string): string => {
    // This could be replaced with a more robust lookup from courses data
    // For now we'll use a simple mapping
    const courseTitles: Record<string, string> = {
      'D426': 'Data Management'
    };
    return courseTitles[courseId] || courseId;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Get recent attempts (for Recent tab)
  const recentAttempts = [...history].sort((a, b) => b.date - a.date).slice(0, 10);

  // Get best attempts per course
  const bestAttempts = history.reduce((best: AttemptDetails[], current) => {
    const existingBest = best.find(attempt => attempt.courseId === current.courseId);
    
    if (!existingBest || current.percentage > existingBest.percentage) {
      // Remove existing best if there is one
      const filtered = best.filter(attempt => attempt.courseId !== current.courseId);
      return [...filtered, current];
    }
    
    return best;
  }, []);

  // View attempt details
  const handleViewDetails = (attempt: AttemptDetails) => {
    setSelectedAttempt(attempt);
    setShowDetailsDialog(true);
  };

  // Delete attempt
  const handleDeleteAttempt = async (id: string) => {
    setIsLoading(true);
    try {
      // This is where we would call an API to delete the attempt
      // For now, we'll just remove it from local state and localStorage
      const historyJSON = localStorage.getItem('quizHistory');
      if (historyJSON) {
        const historyData = JSON.parse(historyJSON);
        const updatedHistory = historyData.filter((item: QuizAttempt) => item.id !== id);
        localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
        
        // Update local state
        setHistory(prev => prev.filter(item => item.id !== id));
      }
      setConfirmDeleteId(null);
    } catch (err) {
      setError('Failed to delete attempt');
    } finally {
      setIsLoading(false);
    }
  };

  // Retry quiz from the same course
  const handleRetryQuiz = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  // Function to get color based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 80) return "Excellent! You've mastered this material.";
    if (percentage >= 60) return "Good job! You've got a solid understanding.";
    if (percentage >= 40) return "Not bad, but there's room for improvement.";
    return "You might need to review this material more thoroughly.";
  };

  // Render the details dialog
  const renderDetailsDialog = () => {
    if (!selectedAttempt) return null;

    return (
      <Dialog 
        open={showDetailsDialog} 
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Quiz Results</Typography>
          {selectedAttempt.questionBankName && (
            <Typography variant="subtitle1" color="primary.main">
              {selectedAttempt.questionBankName}
            </Typography>
          )}
          <Typography variant="subtitle2" color="text.secondary">
            {formatDateTime(selectedAttempt.date)}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {/* Result summary */}
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress 
                variant="determinate" 
                value={selectedAttempt.percentage} 
                size={120}
                thickness={4}
                sx={{ 
                  color: getScoreColor(selectedAttempt.percentage),
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {Math.round(selectedAttempt.percentage)}%
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="h6" align="center" gutterBottom color={getScoreColor(selectedAttempt.percentage)}>
            {getScoreMessage(selectedAttempt.percentage)}
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Score
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {selectedAttempt.score} / {selectedAttempt.totalQuestions}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Time Taken
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatDuration(0, selectedAttempt.timeTaken)}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Accuracy
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={selectedAttempt.percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          backgroundColor: getScoreColor(selectedAttempt.percentage),
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(selectedAttempt.percentage)}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Quiz settings */}
          <Typography variant="h6" gutterBottom>
            Quiz Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Quiz Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedAttempt.questionBankName || "Practice Quiz"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Questions
                  </Typography>
                  <Typography variant="body1">
                    {selectedAttempt.totalQuestions} questions
                    {selectedAttempt.settings?.shuffleQuestions ? " (shuffled)" : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Time Limit
                  </Typography>
                  <Typography variant="body1">
                    {selectedAttempt.settings?.timeLimit ? 
                      `${selectedAttempt.settings.timeLimit} minutes` : 
                      "No time limit"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Feedback
                  </Typography>
                  <Typography variant="body1">
                    {selectedAttempt.settings?.showFeedback ?
                      "Immediate feedback during quiz" :
                      "Feedback at end of quiz"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Questions and answers */}
          <Typography variant="h6" gutterBottom>
            Question Summary
          </Typography>
          
          <List sx={{ 
            width: '100%', 
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1
          }}>
            {selectedAttempt.questions.map((question, index) => {
              const userAnswer = selectedAttempt.userAnswers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              // Find the correct option text
              const correctOptionText = question.options.find(
                option => option.id === question.correctAnswer
              )?.text || '';
              
              // Find the user selected option text
              const userOptionText = question.options.find(
                option => option.id === userAnswer
              )?.text || 'Not answered';
              
              return (
                <React.Fragment key={question.id}>
                  {index > 0 && <Divider />}
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="subtitle1" 
                            component="span"
                            sx={{ fontWeight: 'bold', mr: 1 }}
                          >
                            Q{index + 1}:
                          </Typography>
                          <Typography 
                            variant="subtitle1" 
                            component="span"
                            sx={{ 
                              mr: 1,
                              maxWidth: '70%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {question.question}
                          </Typography>
                          {isCorrect ? (
                            <CheckIcon 
                              sx={{ 
                                ml: 'auto', 
                                color: theme.palette.success.main 
                              }} 
                            />
                          ) : (
                            <CloseIcon 
                              sx={{ 
                                ml: 'auto', 
                                color: theme.palette.error.main 
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Your answer: 
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ 
                              color: isCorrect 
                                ? theme.palette.success.main 
                                : theme.palette.error.main,
                              ml: 1
                            }}
                          >
                            {userOptionText}
                          </Typography>
                          
                          {!isCorrect && (
                            <>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                Correct answer: 
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ 
                                  color: theme.palette.success.main,
                                  ml: 1
                                }}
                              >
                                {correctOptionText}
                              </Typography>
                            </>
                          )}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              setShowDetailsDialog(false);
              handleRetryQuiz(selectedAttempt.courseId);
            }}
            startIcon={<RestartIcon />}
          >
            Retry Quiz
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render the delete confirmation dialog
  const renderDeleteConfirmDialog = () => {
    return (
      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this quiz attempt? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button 
            color="error" 
            onClick={() => confirmDeleteId && handleDeleteAttempt(confirmDeleteId)}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render the history table
  // Render the history table
const renderHistoryTable = (attempts: AttemptDetails[]) => {
  if (attempts.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center', bgcolor: theme.palette.grey[50] }}>
        <Typography variant="body1" gutterBottom>
          You haven't taken any quizzes yet.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Browse Courses
        </Button>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Quiz Type</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Score</TableCell>
            <TableCell>Time Taken</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attempts.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontWeight="bold">
                  {row.courseTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.courseId}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {row.questionBankName || "Practice Quiz"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.totalQuestions} questions
                </Typography>
              </TableCell>
              <TableCell>
                {formatDate(row.date)}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={`${Math.round(row.percentage)}%`}
                    size="small"
                    sx={{ 
                      bgcolor: getScoreColor(row.percentage),
                      color: 'white',
                      fontWeight: 'bold',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">
                    {row.score}/{row.totalQuestions}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {formatDuration(0, row.timeTaken)}
              </TableCell>
              <TableCell align="right">
                <IconButton 
                  color="primary"
                  size="small"
                  title="View Details"
                  onClick={() => handleViewDetails(row)}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton 
                  color="secondary"
                  size="small"
                  title="Retry Quiz"
                  onClick={() => handleRetryQuiz(row.courseId)}
                >
                  <RetryIcon />
                </IconButton>
                <IconButton 
                  color="error"
                  size="small"
                  title="Delete"
                  onClick={() => setConfirmDeleteId(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Quiz History
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View your past quiz attempts and track your progress over time
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="history tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Recent" />
          <Tab label="Best Scores" />
          <Tab label="All Attempts" />
        </Tabs>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Recent Quiz Attempts
            </Typography>
            {renderHistoryTable(recentAttempts)}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Best Scores by Course
            </Typography>
            {renderHistoryTable(bestAttempts)}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              All Quiz Attempts
            </Typography>
            {renderHistoryTable([...history].sort((a, b) => b.date - a.date))}
          </TabPanel>
        </>
      )}

      {/* Render dialogs */}
      {renderDetailsDialog()}
      {renderDeleteConfirmDialog()}
    </Container>
  );
};

export default HistoryPage;
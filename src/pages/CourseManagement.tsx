import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Quiz as QuizIcon,
  History as HistoryIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Import QuizSettings component
import QuizSettings, { QuizSettingsData } from '@/components/quiz/QuizSettings';

// Import Quiz Context
import { useQuiz } from '@/contexts/QuizContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`course-tabpanel-${index}`}
      aria-labelledby={`course-tab-${index}`}
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

const CourseManagement = () => {
  const theme = useTheme();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Use the quiz context
  const { 
    selectCourse, 
    startQuiz, 
    courses, 
    questionBanks,
    loadQuestionBanks,
    isLoading, 
    error,
    quizState
  } = useQuiz();

  // Find the current course
  const course = courses.find(c => c.id === courseId);

  // Load course data when component mounts
  useEffect(() => {
    if (courseId) {
      selectCourse(courseId);
    }
  }, [courseId, selectCourse]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStartQuiz = (settings: QuizSettingsData) => {
    if (courseId) {
      startQuiz(settings).then(() => {
        navigate(`/quiz/${courseId}`);
      });
    }
  };

  if (isLoading || !course) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.code}: {course.title}
        </Typography>
        <Typography variant="subtitle1">
          {course.description}
        </Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="course tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<QuizIcon />} label="Start Quiz" />
          <Tab icon={<HistoryIcon />} label="History" />
          <Tab icon={<InfoIcon />} label="Information" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Configure your quiz
        </Typography>
        
        {/* Add the QuizSettings component with question banks */}
        <QuizSettings 
          course={course}
          onStartQuiz={handleStartQuiz}
          categories={[]}
          questionBanks={questionBanks}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Your Quiz History
        </Typography>
        <Card elevation={1}>
          <CardContent>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No quiz history available yet for this course.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/history')}
                sx={{ mt: 2 }}
              >
                View All History
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Course Information
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Course Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>
                    <strong>Course Code:</strong> {course.code}
                  </Typography>
                  <Typography>
                    <strong>Total Questions:</strong> {course.totalQuestions}
                  </Typography>
                  <Typography>
                    <strong>Estimated Time:</strong> {course.estimatedTime} minutes
                  </Typography>
                  <Typography>
                    <strong>Difficulty:</strong> {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </Typography>
                  <Typography>
                    <strong>Available Question Banks:</strong> {questionBanks.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Your Progress
                </Typography>
                {course.completionRate !== undefined ? (
                  <Box>
                    <Typography>
                      <strong>Completion Rate:</strong> {course.completionRate}%
                    </Typography>
                    {course.lastAttempt && (
                      <Typography>
                        <strong>Last Attempt:</strong> {course.lastAttempt}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography>
                    You haven't taken any quizzes for this course yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default CourseManagement;
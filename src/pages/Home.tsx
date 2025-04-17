import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Divider,
  Container,
  useTheme
} from '@mui/material';
import { 
  School as SchoolIcon, 
  PlayArrow as StartIcon,
  Assessment as AssessmentIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import the CourseSelection component
import CourseSelection from '@/components/quiz/CourseSelection';
import { Course } from '@/components/quiz/CourseSelection';

interface QuizAttempt {
  id: string;
  courseId: string;
  date: number;
  score: number;
  percentage: number;
}

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Mock data until connected to real context
  const isLoading = false;
  const error = null;
  const coursesData: Course[] = [
    {
      id: 'D426',
      code: 'D426',
      title: 'Data Management',
      description: 'Learn about data management foundations, including database concepts, normalization, SQL, and entity-relationship modeling.',
      totalQuestions: 69,
      estimatedTime: 60,
      difficulty: 'intermediate',
      completionRate: 0,
    }
  ];
  
  const recentAttempts: QuizAttempt[] = [];

  const handleCourseSelect = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  // Mocked courses with progress data
  const coursesWithProgress = coursesData.map(course => {
    return {
      ...course,
      completionRate: 0,
      lastAttempt: undefined
    };
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Quiz Master
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Test your knowledge with our interactive quizzes
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper 
          elevation={1}
          sx={{ 
            p: 3, 
            bgcolor: theme.palette.error.light,
            color: theme.palette.error.contrastText
          }}
        >
          <Typography variant="body1">{error}</Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 6 }} id="courses-section">
            <Typography variant="h5" component="h2" gutterBottom>
              Your Courses
            </Typography>
            <CourseSelection 
              courses={coursesWithProgress} 
              onCourseSelect={handleCourseSelect} 
            />
          </Box>

          {recentAttempts.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Recent Activity
              </Typography>
              <Grid container spacing={3}>
                {/* Recent activity items would go here */}
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={() => navigate('/history')}
                >
                  View All History
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
      
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Start Learning
              </Typography>
              <Typography variant="body1" paragraph>
                Choose from our selection of courses and test your knowledge
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                startIcon={<StartIcon />}
                sx={{ 
                  mt: 'auto',
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.grey[100],
                  }
                }}
                onClick={() => {
                  const element = document.getElementById('courses-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Browse Courses
              </Button>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper 
              elevation={1}
              sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                bgcolor: theme.palette.secondary.light,
                color: theme.palette.secondary.contrastText
              }}
            >
              <AssessmentIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Track Progress
              </Typography>
              <Typography variant="body1" paragraph>
                View your quiz history and track your improvement over time
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                startIcon={<HistoryIcon />}
                sx={{ 
                  mt: 'auto',
                  bgcolor: 'white',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: theme.palette.grey[100],
                  }
                }}
                onClick={() => navigate('/results')}
              >
                View Results
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
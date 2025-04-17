import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  PlayArrow as RetryIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
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

interface AttemptRow {
  id: string;
  courseId: string;
  courseTitle: string;
  date: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
}

const Results = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Mock data
  const isLoading = false;
  const history: AttemptRow[] = [
    {
      id: '1',
      courseId: 'D426',
      courseTitle: 'Data Management',
      date: Date.now() - 86400000, // yesterday
      score: 8,
      totalQuestions: 10,
      percentage: 80,
      timeTaken: 600000 // 10 minutes
    },
    {
      id: '2',
      courseId: 'D426',
      courseTitle: 'Data Management',
      date: Date.now() - 172800000, // 2 days ago
      score: 7,
      totalQuestions: 10,
      percentage: 70,
      timeTaken: 540000 // 9 minutes
    }
  ];

  // Check if we're on the history page
  const isHistoryPage = location.pathname === '/history';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Get recent attempts (for recent tab)
  const recentAttempts = [...history].sort((a, b) => b.date - a.date).slice(0, 10);

  // Get best attempts per course
  const bestAttempts = history.reduce((best: AttemptRow[], current) => {
    const existingBest = best.find(attempt => attempt.courseId === current.courseId);
    
    if (!existingBest || current.percentage > existingBest.percentage) {
      // Remove existing best if there is one
      const filtered = best.filter(attempt => attempt.courseId !== current.courseId);
      return [...filtered, current];
    }
    
    return best;
  }, []);

  // Function to get color based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Format date helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Format time helper
  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        {isHistoryPage ? 'Quiz History' : 'Your Results'}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        View your past quiz attempts and track your progress over time
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="results tabs"
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
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Recent Quiz Attempts
            </Typography>
            
            {recentAttempts.length === 0 ? (
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
            ) : (
              <TableContainer component={Paper} elevation={1}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Time Taken</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAttempts.map((row) => (
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
                          {formatTime(row.timeTaken)}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary"
                            size="small"
                            title="View Details"
                            onClick={() => {/* View attempt details */}}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary"
                            size="small"
                            title="Retry Quiz"
                            onClick={() => navigate(`/course/${row.courseId}`)}
                          >
                            <RetryIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Best Scores by Course
            </Typography>
            
            {bestAttempts.length === 0 ? (
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
            ) : (
              <TableContainer component={Paper} elevation={1}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Time Taken</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bestAttempts.map((row) => (
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
                          {formatTime(row.timeTaken)}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary"
                            size="small"
                            title="View Details"
                            onClick={() => {/* View attempt details */}}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            color="secondary"
                            size="small"
                            title="Retry Quiz"
                            onClick={() => navigate(`/course/${row.courseId}`)}
                          >
                            <RetryIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              All Quiz Attempts
            </Typography>
            
            {history.length === 0 ? (
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
            ) : (
              <TableContainer component={Paper} elevation={1}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Course</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Time Taken</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...history].sort((a, b) => b.date - a.date).map((row) => (
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
                          {formatTime(row.timeTaken)}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            color="primary"
                            size="small"
                            title="View Details"
                            onClick={() => {/* View attempt details */}}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton 
                            color="error"
                            size="small"
                            title="Delete"
                            onClick={() => {/* Delete attempt */}}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </>
      )}
    </Container>
  );
};

export default Results;
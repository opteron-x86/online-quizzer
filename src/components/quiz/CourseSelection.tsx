import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Chip,
  useTheme,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  School as SchoolIcon,
  CheckCircle as CompletedIcon,
  Inventory2 as QuestionsIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  totalQuestions: number;
  estimatedTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionRate?: number;
  lastAttempt?: string;
}

interface CourseSelectionProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
}

const CourseSelection: React.FC<CourseSelectionProps> = ({ courses, onCourseSelect }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return theme.palette.success.main;
      case 'intermediate':
        return theme.palette.warning.main;
      case 'advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };
  
  const handleCourseClick = (courseId: string) => {
    onCourseSelect(courseId);
    navigate(`/course/${courseId}`);
  };

  if (courses.length === 0) {
    return (
      <Paper 
        elevation={1}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: theme.palette.grey[50]
        }}
      >
        <SchoolIcon 
          sx={{ 
            fontSize: 60, 
            color: theme.palette.grey[400],
            mb: 2
          }} 
        />
        <Typography variant="h6" gutterBottom>
          No courses available
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please check back later or contact your administrator.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
          <Card 
            elevation={2}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[6],
              }
            }}
          >
            <CardActionArea 
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              onClick={() => handleCourseClick(course.id)}
            >
              <Box 
                sx={{ 
                  p: 2, 
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Typography 
                  variant="overline" 
                  component="div"
                  sx={{ fontWeight: 'bold' }}
                >
                  {course.code}
                </Typography>
                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {course.title}
                </Typography>
                
                <Chip
                  label={course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  size="small"
                  sx={{
                    backgroundColor: getDifficultyColor(course.difficulty),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                
                {/* Abstract background element */}
                <Box
                  sx={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {course.description}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <QuestionsIcon 
                        fontSize="small" 
                        sx={{ color: theme.palette.text.secondary, mr: 1 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {course.totalQuestions} Questions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TimeIcon 
                        fontSize="small" 
                        sx={{ color: theme.palette.text.secondary, mr: 1 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {course.estimatedTime} min
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {course.completionRate !== undefined && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.completionRate}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.completionRate} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: theme.palette.grey[200],
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: 
                            course.completionRate === 100 
                              ? theme.palette.success.main 
                              : theme.palette.primary.main
                        }
                      }}
                    />
                  </Box>
                )}
                
                {course.lastAttempt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <CompletedIcon 
                      fontSize="small" 
                      sx={{ 
                        color: course.completionRate === 100 
                          ? theme.palette.success.main 
                          : theme.palette.grey[400],
                        mr: 1 
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Last attempt: {course.lastAttempt}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseSelection;
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  useTheme,
  Grid,
  LinearProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  RestartAlt as RestartIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { formatTime } from '../../utils/formatters';
import { Question } from './QuestionCard';

interface ResultSummaryProps {
  score: number;
  totalQuestions: number;
  timeTaken: number;
  questions: Question[];
  userAnswers: Record<string, string>;
  onRestart: () => void;
  onReview: () => void;
  onHome: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({
  score,
  totalQuestions,
  timeTaken,
  questions,
  userAnswers,
  onRestart,
  onReview,
  onHome
}) => {
  const theme = useTheme();
  const percentage = (score / totalQuestions) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 80) return theme.palette.success.main;
    if (percentage >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreMessage = () => {
    if (percentage >= 80) return "Excellent! You've mastered this material.";
    if (percentage >= 60) return "Good job! You've got a solid understanding.";
    if (percentage >= 40) return "Not bad, but there's room for improvement.";
    return "You might need to review this material more thoroughly.";
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 4, 
        maxWidth: 800, 
        mx: 'auto',
        borderRadius: 2
      }}
    >
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Quiz Results
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress 
            variant="determinate" 
            value={percentage} 
            size={120}
            thickness={4}
            sx={{ 
              color: getScoreColor(),
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
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography variant="h6" align="center" gutterBottom color={getScoreColor()}>
        {getScoreMessage()}
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
              {score} / {totalQuestions}
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
              {formatTime(timeTaken)}
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
                  value={percentage}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: getScoreColor(),
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {Math.round(percentage)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        Question Summary
      </Typography>
      
      <List sx={{ 
        width: '100%', 
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        mb: 4
      }}>
        {questions.slice(0, 5).map((question, index) => {
          const userAnswer = userAnswers[question.id];
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
      
      {questions.length > 5 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={onReview}
            startIcon={<ArrowBackIcon />}
          >
            See All Questions
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={onHome}
        >
          Back to Home
        </Button>
        
        <Button
          variant="contained"
          startIcon={<RestartIcon />}
          onClick={onRestart}
          color="primary"
        >
          Retake Quiz
        </Button>
      </Box>
    </Paper>
  );
};

export default ResultSummary;
import React from 'react';
import { 
  Box, 
  LinearProgress, 
  Typography, 
  Tooltip,
  styled,
  useTheme
} from '@mui/material';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number[];
}

// Styled component for the progress dots
const ProgressDot = styled(Box)(() => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  margin: '0 4px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentQuestion, 
  totalQuestions,
  answeredQuestions
}) => {
  const theme = useTheme();
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const getDotStatus = (index: number) => {
    if (index === currentQuestion) return 'current';
    if (answeredQuestions.includes(index)) return 'answered';
    return 'unanswered';
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case 'current':
        return theme.palette.primary.main;
      case 'answered':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[300];
    }
  };

  const getDotBorder = (status: string) => {
    switch (status) {
      case 'current':
        return `2px solid ${theme.palette.primary.main}`;
      case 'answered':
        return `2px solid ${theme.palette.success.main}`;
      default:
        return `2px solid ${theme.palette.grey[400]}`;
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Question {currentQuestion + 1} of {totalQuestions}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {answeredQuestions.length} answered
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          mb: 2
        }} 
      />
      
      {/* Question dots for quick navigation */}
      {totalQuestions <= 20 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 0.5
        }}>
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = getDotStatus(index);
            return (
              <Tooltip 
                key={index} 
                title={`Question ${index + 1} (${status})`}
                arrow
              >
                <ProgressDot 
                  sx={{ 
                    bgcolor: getDotColor(status),
                    border: getDotBorder(status),
                    transform: index === currentQuestion ? 'scale(1.2)' : 'none'
                  }}
                  // onClick handler would be implemented if we add navigation
                />
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ProgressBar;
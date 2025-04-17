import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Divider,
  Button,
  useTheme,
  Paper,
  Stack,
  // Alert
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, BrokenImage as BrokenImageIcon } from '@mui/icons-material';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface ImagePathOptions {
  primary: string;
  fallback: string;
  lastResort: string;
}

export interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  imageUrls?: string[];
  imagePathOptions?: ImagePathOptions[]; // Added for fallback paths
}

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  showFeedback?: boolean;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showFeedback = false,
  onNextQuestion,
  onPrevQuestion,
}) => {
  const theme = useTheme();
  const [showExplanation, setShowExplanation] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, number>>({});
  const [imageLoadingStatus, setImageLoadingStatus] = useState<Record<number, 'loading' | 'loaded' | 'error'>>({});

  useEffect(() => {
    // Reset explanation and image errors when question changes
    setShowExplanation(false);
    setImageErrors({});
    setImageLoadingStatus({});
    
    // Debug log for image URLs
    if (question.imageUrls && question.imageUrls.length > 0) {
      console.log('Question with images:', question.id);
      console.log('Image URLs:', question.imageUrls);
      console.log('Image path options:', question.imagePathOptions);
    }
  }, [question.id]);

  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleAnswerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerSelect(question.id, event.target.value);
  };

  // Function to get appropriate image URL with fallback support
  const getImageUrl = (index: number) => {
    if (!question.imageUrls || !question.imageUrls[index]) {
      return '/placeholders/image-placeholder.png';
    }
    
    // If we have path options and there's an error, try the next path
    if (question.imagePathOptions && index in imageErrors) {
      const errorCount = imageErrors[index];
      const pathOptions = question.imagePathOptions[index];
      
      if (errorCount === 1 && pathOptions.fallback) {
        return pathOptions.fallback;
      }
      else if (errorCount >= 2 && pathOptions.lastResort) {
        return pathOptions.lastResort;
      }
    }
    
    // Default to primary URL
    return question.imageUrls[index];
  };

  // Handle image load success
  const handleImageLoad = (index: number) => {
    setImageLoadingStatus(prev => ({
      ...prev,
      [index]: 'loaded'
    }));
    console.log(`Image ${index} loaded successfully with URL: ${getImageUrl(index)}`);
  };

  // Handle image load error
  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}. URL attempted: ${getImageUrl(index)}`);
    
    setImageLoadingStatus(prev => ({
      ...prev,
      [index]: 'error'
    }));
    
    setImageErrors(prev => {
      const currentErrorCount = prev[index] || 0;
      // If we've already tried all fallbacks, don't increment further
      if (question.imagePathOptions && currentErrorCount >= 2) {
        return prev;
      }
      return {
        ...prev,
        [index]: currentErrorCount + 1
      };
    });
  };

  return (
    <Card sx={{ 
      width: '100%', 
      maxWidth: 800, 
      mx: 'auto',
      boxShadow: theme.shadows[3],
      borderRadius: 2
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Question {currentIndex + 1} of {totalQuestions}
          </Typography>
        </Box>

        <Typography variant="h6" component="div" sx={{ mb: 3 }}>
          {question.question}
        </Typography>

        {/* Display images if available */}
        {question.imageUrls && question.imageUrls.length > 0 && (
          <Stack spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
            {question.imageUrls.map((_, index) => (
              <Box key={index} sx={{ position: 'relative', width: '100%', maxWidth: 500 }}>
                <Box 
                  component="img"
                  src={getImageUrl(index)}
                  alt={`Question ${question.id} image ${index + 1}`}
                  sx={{ 
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    display: imageLoadingStatus[index] === 'error' ? 'none' : 'block'
                  }}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                />
                
                {/* Show error message if image fails to load */}
                {imageLoadingStatus[index] === 'error' && imageErrors[index] >= 3 && (
                  <Box sx={{ 
                    p: 2, 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.grey[100],
                    height: 200
                  }}>
                    <BrokenImageIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Image failed to load
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )}

        <RadioGroup
          value={selectedAnswer || ''}
          onChange={handleAnswerSelect}
        >
          {question.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={
                <Radio 
                  color={showFeedback && selectedAnswer === option.id 
                    ? (isCorrect ? "success" : "error") 
                    : "primary"
                  }
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{option.text}</Typography>
                  {showFeedback && selectedAnswer === option.id && (
                    isCorrect 
                      ? <CheckIcon color="success" sx={{ ml: 1 }} />
                      : <CloseIcon color="error" sx={{ ml: 1 }} />
                  )}
                  {showFeedback && option.id === question.correctAnswer && selectedAnswer !== option.id && (
                    <CheckIcon color="success" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              sx={{
                p: 1,
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                ...(showFeedback && selectedAnswer === option.id && {
                  backgroundColor: isCorrect 
                    ? alpha(theme.palette.success.main, 0.1)
                    : alpha(theme.palette.error.main, 0.1),
                }),
              }}
              disabled={showFeedback}
            />
          ))}
        </RadioGroup>

        {showFeedback && (
          <>
            <Button 
              onClick={() => setShowExplanation(!showExplanation)}
              sx={{ mt: 2 }}
              color="primary"
            >
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>

            {showExplanation && question.explanation && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  mt: 2, 
                  backgroundColor: theme.palette.grey[50],
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">Explanation:</Typography>
                <Typography variant="body2">{question.explanation}</Typography>
              </Paper>
            )}
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={onPrevQuestion} 
            disabled={currentIndex === 0}
            variant="outlined"
          >
            Previous
          </Button>
          <Button 
            onClick={onNextQuestion} 
            disabled={currentIndex === totalQuestions - 1 || !selectedAnswer}
            variant="contained"
          >
            {currentIndex === totalQuestions - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Helper function to create alpha color (missing from MUI import)
function alpha(color: string, value: number): string {
  return color + Math.round(value * 255).toString(16).padStart(2, '0');
}

export default QuestionCard;
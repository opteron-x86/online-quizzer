import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  useTheme,
  Grid,
  Card,
  CardContent,
  OutlinedInput,
  SelectChangeEvent,
  Alert
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Timer as TimerIcon,
  MenuBook as BankIcon
} from '@mui/icons-material';
import { Course } from '../quiz/CourseSelection';
import { QuestionBankListItem } from '../../types/questionBank';
import { useQuiz } from '../../contexts/QuizContext';

export interface QuizSettingsData {
  numberOfQuestions: number;
  timeLimit: number; // in minutes, 0 means no limit
  showFeedback: boolean;
  shuffleQuestions: boolean;
  categories?: string[];
  questionBankId?: string; // Added to support question bank selection
  courseId?: string; // Added to support course-specific file structure
}

interface QuizSettingsProps {
  course: Course;
  onStartQuiz: (settings: QuizSettingsData) => void;
  categories?: { id: string; name: string }[];
  questionBanks?: QuestionBankListItem[];
}

const QuizSettings: React.FC<QuizSettingsProps> = ({ 
  course, 
  onStartQuiz,
  categories = [],
  questionBanks = []
}) => {
  const theme = useTheme();
  const { appSettings } = useQuiz();
  
  // Initial state setup using app settings
  const [settings, setSettings] = useState<QuizSettingsData>({
    numberOfQuestions: Math.min(appSettings.defaultQuestionCount, course.totalQuestions),
    timeLimit: appSettings.defaultTimeLimit,
    showFeedback: appSettings.showFeedback,
    shuffleQuestions: appSettings.shuffleQuestions,
    categories: categories.length > 0 ? [] : undefined,
    questionBankId: questionBanks.length > 0 ? 
      questionBanks.find(bank => bank.isDefault)?.id : 
      undefined,
    courseId: course.id // Add the course ID to settings
  });
  
  // Update settings when app settings change
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      numberOfQuestions: Math.min(appSettings.defaultQuestionCount, course.totalQuestions),
      timeLimit: appSettings.defaultTimeLimit,
      showFeedback: appSettings.showFeedback,
      shuffleQuestions: appSettings.shuffleQuestions,
    }));
  }, [appSettings, course.totalQuestions]);
  
  // Update maxQuestions when questionBank changes
  useEffect(() => {
    if (settings.questionBankId) {
      const selectedBank = questionBanks.find(bank => bank.id === settings.questionBankId);
      if (selectedBank && selectedBank.questionCount > 0) {
        if (settings.numberOfQuestions > selectedBank.questionCount) {
          setSettings(prev => ({
            ...prev,
            numberOfQuestions: selectedBank.questionCount
          }));
        }
      }
    }
  }, [settings.questionBankId, questionBanks, settings.numberOfQuestions]);
  
  const handleNumberOfQuestionsChange = (_event: Event, newValue: number | number[]) => {
    setSettings({
      ...settings,
      numberOfQuestions: newValue as number
    });
  };
  
  const handleTimeLimitChange = (_event: Event, newValue: number | number[]) => {
    setSettings({
      ...settings,
      timeLimit: newValue as number
    });
  };
  
  const handleSwitchChange = (name: keyof QuizSettingsData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [name]: event.target.checked
    });
  };
  
  const handleCategoriesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSettings({
      ...settings,
      categories: typeof value === 'string' ? value.split(',') : value,
    });
  };
  
  const handleQuestionBankChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSettings({
      ...settings,
      questionBankId: value
    });
  };
  
  // startQuiz function
  const startQuiz = () => {
    // Make sure courseId is included in the settings
    onStartQuiz({
      ...settings,
      courseId: course.id
    });
  };

  // Get the max questions for the current selection
  const getCurrentMaxQuestions = () => {
    if (settings.questionBankId) {
      const selectedBank = questionBanks.find(bank => bank.id === settings.questionBankId);
      return selectedBank?.questionCount || course.totalQuestions;
    }
    return course.totalQuestions;
  };

  const currentMaxQuestions = getCurrentMaxQuestions();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 4,
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Quiz Settings
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Configure your quiz for {course.code}: {course.title}
        </Typography>
        
        {questionBanks.length > 0 && (
          <Card elevation={1} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BankIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">
                  Question Bank
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select which question bank to use for this quiz.
              </Typography>
              
              <FormControl fullWidth>
                <InputLabel id="question-bank-label">Question Bank</InputLabel>
                <Select
                  labelId="question-bank-label"
                  value={settings.questionBankId || ''}
                  onChange={handleQuestionBankChange}
                  input={<OutlinedInput label="Question Bank" />}
                >
                  {questionBanks.map((bank) => (
                    <MenuItem key={bank.id} value={bank.id}>
                      {bank.name} ({bank.questionCount} questions)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        )}
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card 
              elevation={1}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Number of Questions
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Select how many questions you want to include in your quiz.
                </Typography>
                
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={settings.numberOfQuestions}
                    onChange={handleNumberOfQuestionsChange}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={currentMaxQuestions}
                    sx={{ mt: 5 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      1
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {settings.numberOfQuestions} questions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentMaxQuestions}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card 
              elevation={1}
              sx={{ height: '100%' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimerIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">
                    Time Limit
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Set a time limit for your quiz or set to 0 for unlimited time.
                </Typography>
                
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={settings.timeLimit}
                    onChange={handleTimeLimitChange}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={120}
                    sx={{ mt: 5 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      No limit
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {settings.timeLimit === 0 
                        ? "No time limit" 
                        : `${settings.timeLimit} minutes`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      120 min
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <Card elevation={1}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Additional Options
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.showFeedback}
                          onChange={handleSwitchChange('showFeedback')}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1">
                            Show Immediate Feedback
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Show correct answers after each question
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Grid>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.shuffleQuestions}
                          onChange={handleSwitchChange('shuffleQuestions')}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1">
                            Shuffle Questions
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Randomize the order of questions
                          </Typography>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Grid>
                </Grid>
                
                {categories.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel id="categories-label">Categories</InputLabel>
                      <Select
                        labelId="categories-label"
                        multiple
                        value={settings.categories || []}
                        onChange={handleCategoriesChange}
                        input={<OutlinedInput label="Categories" />}
                        renderValue={(selected) => {
                          const selectedNames = selected.map(
                            id => categories.find(c => c.id === id)?.name || id
                          );
                          return selectedNames.join(', ');
                        }}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Select specific categories to focus on, or leave empty to include all categories
                      </Typography>
                    </FormControl>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Alert severity="info" sx={{ mt: 4 }}>
          You will need to answer {settings.numberOfQuestions} questions
          {settings.timeLimit > 0 ? ` within ${settings.timeLimit} minutes` : ''}.
          {settings.showFeedback 
            ? ' You will see feedback after each question.' 
            : ' You will see your results at the end.'}
          {settings.questionBankId && questionBanks.length > 0 && 
            ` Using question bank: ${questionBanks.find(b => b.id === settings.questionBankId)?.name}.`}
        </Alert>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<StartIcon />}
            onClick={startQuiz}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem'
            }}
          >
            Start Quiz
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuizSettings;
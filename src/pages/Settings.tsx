import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  Card,
  CardContent,
  Grid,
  useTheme
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useQuiz, AppSettings, defaultAppSettings } from '../contexts/QuizContext';
import useNotification from '../hooks/useNotification';
import Notification from '../components/shared/Notification';

const Settings: React.FC = () => {
  const { appSettings, updateAppSettings } = useQuiz();
  const { notification, showNotification, hideNotification } = useNotification();
  
  // Local state to track form values
  const [formValues, setFormValues] = useState<AppSettings>(appSettings);
  
  // Update local form values when the app settings change
  useEffect(() => {
    setFormValues(appSettings);
  }, [appSettings]);
  
  const handleSwitchChange = (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
  };
  
  const handleNumberChange = (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSaveSettings = () => {
    try {
      // Validate settings before saving
      if (formValues.defaultQuestionCount < 1 || formValues.defaultQuestionCount > 100) {
        showNotification('Questions must be between 1 and 100', 'error');
        return;
      }

      if (formValues.defaultTimeLimit < 0 || formValues.defaultTimeLimit > 120) {
        showNotification('Time limit must be between 0 and 120 minutes', 'error');
        return;
      }

      // Save settings to context
      updateAppSettings(formValues);
      
      showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  };
  
  const handleResetDefaults = () => {
    setFormValues(defaultAppSettings);
    showNotification('Settings reset to defaults', 'info');
  };
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Customize your quiz experience
      </Typography>
      
      <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Appearance
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.darkMode}
                      onChange={handleSwitchChange('darkMode')}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <Typography variant="body2" color="text.secondary">
                  Enable dark mode for the entire application. Changes will apply after saving.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quiz Defaults
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Default Time Limit (minutes)"
                    type="number"
                    value={formValues.defaultTimeLimit}
                    onChange={handleNumberChange('defaultTimeLimit')}
                    fullWidth
                    InputProps={{
                      inputProps: { min: 0, max: 120 }
                    }}
                    helperText="0 for no time limit, max 120 minutes"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Default Questions Per Quiz"
                    type="number"
                    value={formValues.defaultQuestionCount}
                    onChange={handleNumberChange('defaultQuestionCount')}
                    fullWidth
                    InputProps={{
                      inputProps: { min: 1, max: 100 }
                    }}
                    helperText="Between 1 and 100 questions"
                  />
                </Box>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.showFeedback}
                      onChange={handleSwitchChange('showFeedback')}
                      color="primary"
                    />
                  }
                  label="Show Immediate Feedback"
                  sx={{ mb: 1, display: 'block' }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.shuffleQuestions}
                      onChange={handleSwitchChange('shuffleQuestions')}
                      color="primary"
                    />
                  }
                  label="Shuffle Questions by Default"
                  sx={{ display: 'block' }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Management
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2" paragraph>
                  Your quiz history and settings are stored locally in your browser. You can clear this data if needed.
                </Typography>
                
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your quiz history? This action cannot be undone.")) {
                      localStorage.removeItem('quizHistory');
                      showNotification('Quiz history cleared successfully', 'success');
                    }
                  }}
                  sx={{ mr: 2 }}
                >
                  Clear Quiz History
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="warning"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear all app data? This will reset all settings and history.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  Clear All App Data
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleResetDefaults}
            startIcon={<RefreshIcon />}
          >
            Reset to Defaults
          </Button>
          
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>
      
      <Notification 
        open={notification.open}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        onClose={hideNotification}
      />
    </Container>
  );
};

export default Settings;
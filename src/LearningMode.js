import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, FormControlLabel, Checkbox, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DOMPurify from 'dompurify'; // For sanitizing the HTML content
import { getEntriesByLanguageAndCategory, updateEntry } from './dataStorage';

function LearningMode({ isScriptLoaded }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentEntry, setCurrentEntry] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [learningComplete, setLearningComplete] = useState(false); // Track if learning is complete

  const languages = ['Spanish', 'French', 'German']; // Dropdown options

  const handleLearningStart = () => {
    const entries = getEntriesByLanguageAndCategory(selectedLanguage, selectedCategory);
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setCurrentEntry(randomEntry);
      setFeedback('');
      setAnswered(false);
      setCorrect(false);
      setLearningComplete(false); // Reset learning complete status
    } else {
      alert('No entries found for this language and category.');
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = answer.toLowerCase() === currentEntry.singleTranslation.toLowerCase();
    const sanitizedLongDescription = DOMPurify.sanitize(currentEntry.longTranslation); // Sanitize HTML content

    const feedbackMessage = correctAnswer
      ? `Correct! ${sanitizedLongDescription}`
      : `Incorrect! The correct answer was: ${currentEntry.singleTranslation}\n${sanitizedLongDescription}`;

    setFeedback(feedbackMessage);
    setCorrect(correctAnswer);
    setAnswered(true);
  };

  const handleFeedbackSubmit = () => {
    const now = new Date();
    const updatedEntry = {
      ...currentEntry,
      lastTested: now.toISOString(),
      points: correct ? currentEntry.points + 5 : 1, // Correct increases points by 5, incorrect reverts to 1
    };
    updateEntry(updatedEntry);

    // Attempt to load another word, or show completion message if none are available
    const entries = getEntriesByLanguageAndCategory(selectedLanguage, selectedCategory);
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setCurrentEntry(randomEntry);
      setAnswer('');
      setAnswered(false);
      setCorrect(false);
      setFeedback('');
    } else {
      setLearningComplete(true); // Mark learning as complete
      setCurrentEntry(null);
    }
  };

  const speakTranslation = () => {
    if (isScriptLoaded && typeof window.responsiveVoice !== 'undefined') {
      const languageMap = {
        Spanish: 'Spanish Female',
        French: 'French Female',
        German: 'Deutsch Female',
        Italian: 'Italian Female',
        English: 'UK English Female',
        Portuguese: 'Portuguese Female',
      };

      const selectedVoice = languageMap[selectedLanguage] || 'UK English Female';
      window.responsiveVoice.speak(currentEntry.singleTranslation, selectedVoice);
    } else {
      console.error('ResponsiveVoice is not loaded or script failed to load');
    }
  };

  return (
    <Box>
      {!currentEntry && !learningComplete ? (
        <Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Language</InputLabel>
            <Select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              label="Select Language"
            >
              {languages.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Select Category"
            variant="outlined"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-field"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleLearningStart}
            className="button"
          >
            Start Learning
          </Button>
        </Box>
      ) : learningComplete ? (
        // Show "Learning complete!" message when there are no more words to learn
        <Alert severity="success" sx={{ marginTop: 2 }} className="alert">
          <Typography variant="h6">Learning complete!</Typography>
        </Alert>
      ) : (
        <Box>
          <Typography variant="h6" gutterBottom>
            Translate: {currentEntry.englishWord}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Your Answer"
            variant="outlined"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={answered}
            className="text-field"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleAnswerSubmit}
            disabled={answered}
            className="button"
          >
            Submit Answer
          </Button>

          {feedback && (
            <Alert severity={correct ? 'success' : 'error'} sx={{ marginTop: 2 }} className="alert">
              <Typography>{correct ? 'Correct!' : 'Incorrect!'}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                {correct ? 'Translation Details:' : 'Correct Answer:'}
              </Typography>
              <Typography dangerouslySetInnerHTML={{ __html: feedback }} /> {/* Render sanitized HTML */}
            </Alert>
          )}

          {answered && (
            <Box sx={{ marginTop: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={correct}
                    onChange={(e) => setCorrect(e.target.checked)}
                    color="primary"
                  />
                }
                label="I got this right"
              />
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={handleFeedbackSubmit}
                className="button"
              >
                Confirm and Next
              </Button>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginTop: 2 }}
                onClick={speakTranslation}
                className="button"
                disabled={!isScriptLoaded} // Disable button if script is not loaded
              >
                Hear Translation
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default LearningMode;
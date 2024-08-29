import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { getEntriesByLanguageAndCategory, updateEntry } from './dataStorage';

function LearningMode({ setMode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentEntry, setCurrentEntry] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleLearningStart = () => {
    const entries = getEntriesByLanguageAndCategory(selectedLanguage, selectedCategory);
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setCurrentEntry(randomEntry);
      setFeedback('');
      setAnswered(false);
      setCorrect(false);
    } else {
      alert('No entries found for this language and category.');
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswer = answer.toLowerCase() === currentEntry.singleTranslation.toLowerCase();
    const feedbackMessage = correctAnswer
      ? `Correct! ${currentEntry.longTranslation}`
      : `Incorrect! The correct answer was: ${currentEntry.singleTranslation}\n${currentEntry.longTranslation}`;
    setFeedback(feedbackMessage);
    setCorrect(correctAnswer);
    setAnswered(true);
  };

  const handleFeedbackSubmit = () => {
    const now = new Date();
    const updatedEntry = {
      ...currentEntry,
      lastTested: now.toISOString(),
      points: correct ? currentEntry.points + 1 : 0,
    };
    updateEntry(updatedEntry);
    setCurrentEntry(null);
    setAnswer('');
    setAnswered(false);
    setCorrect(false);
  };

  return (
    <Box>
      {!currentEntry ? (
        <Box>
          <TextField
            fullWidth
            margin="normal"
            label="Select Language"
            variant="outlined"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-field"
          />
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
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setMode('input')}
            className="button"
          >
            Switch to Input Mode
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setMode('wordTable')}
            className="button"
          >
            Switch to Word Table Mode
          </Button>
        </Box>
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
              {feedback.split('\n').map((line, index) => (
                <Typography key={index}>{line}</Typography>
              ))}
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
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default LearningMode;

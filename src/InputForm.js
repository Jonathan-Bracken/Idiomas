import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { saveEntry } from './dataStorage';

function InputForm({ setMode }) {
  const [englishWord, setEnglishWord] = useState('');
  const [learningLanguage, setLearningLanguage] = useState('');
  const [singleTranslation, setSingleTranslation] = useState('');
  const [longTranslation, setLongTranslation] = useState('');

  const handleSubmit = () => {
    saveEntry({ englishWord, learningLanguage, singleTranslation, longTranslation });
    setEnglishWord('');
    setLearningLanguage('');
    setSingleTranslation('');
    setLongTranslation('');
    alert('Entry saved!');
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        fullWidth
        margin="normal"
        label="English Word"
        variant="outlined"
        value={englishWord}
        onChange={(e) => setEnglishWord(e.target.value)}
        className="text-field"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Language"
        variant="outlined"
        value={learningLanguage}
        onChange={(e) => setLearningLanguage(e.target.value)}
        className="text-field"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Single Word/Phrase Translation"
        variant="outlined"
        value={singleTranslation}
        onChange={(e) => setSingleTranslation(e.target.value)}
        className="text-field"
      />
      <TextField
        fullWidth
        margin="normal"
        label="Longer Translation and Notes"
        variant="outlined"
        multiline
        rows={4}
        value={longTranslation}
        onChange={(e) => setLongTranslation(e.target.value)}
        className="text-field"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleSubmit}
        className="button"
      >
        Save Entry
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={() => setMode('learning')}
        className="button"
      >
        Switch to Learning Mode
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
  );
}

export default InputForm;

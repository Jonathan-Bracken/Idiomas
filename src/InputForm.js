import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DOMPurify from 'dompurify'; // For sanitizing rich text input
import { saveEntry } from './dataStorage';

function InputForm({ setMode }) {
  const [englishWord, setEnglishWord] = useState('');
  const [learningLanguage, setLearningLanguage] = useState(localStorage.getItem('selectedLanguage') || ''); // Initialize from localStorage
  const [singleTranslation, setSingleTranslation] = useState('');
  const [longTranslation, setLongTranslation] = useState('');
  const [category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const categories = ['None', 'Verbs', 'Adjectives', 'Family', 'Sport', 'Food', 'Clothes', 'Travel', 'Work', 'Home', 'Animals', 'Numbers', 'Colours', 'Time'];
  const languages = ['Spanish', 'French', 'German']; // Add languages to dropdown

  // Update localStorage whenever the learningLanguage changes
  useEffect(() => {
    if (learningLanguage) {
      localStorage.setItem('selectedLanguage', learningLanguage);
    }
  }, [learningLanguage]);

  const handleSubmit = () => {
    const storedEntries = JSON.parse(localStorage.getItem('languageEntries')) || [];
    const existingEntry = storedEntries.find(entry =>
      entry.englishWord.toLowerCase() === englishWord.toLowerCase() &&
      entry.learningLanguage.toLowerCase() === learningLanguage.toLowerCase()
    );

    if (existingEntry) {
      setErrorMessage(`The word "${englishWord}" already exists in ${learningLanguage}.`);
      return;
    }

    const sanitizedTranslation = DOMPurify.sanitize(longTranslation);

    saveEntry({
      englishWord,
      learningLanguage,
      singleTranslation,
      longTranslation: sanitizedTranslation,
      category
    });

    setEnglishWord('');
    setSingleTranslation('');
    setLongTranslation('');
    setCategory('');
    setErrorMessage('');
    alert('Entry saved!');
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <TextField
        fullWidth
        margin="normal"
        label="English Word"
        variant="outlined"
        value={englishWord}
        onChange={(e) => setEnglishWord(e.target.value)}
        className="text-field"
      />

      {/* Language dropdown to persist across entries */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Language</InputLabel>
        <Select
          value={learningLanguage}
          onChange={(e) => setLearningLanguage(e.target.value)}
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              {language}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Single Word/Phrase Translation"
        variant="outlined"
        value={singleTranslation}
        onChange={(e) => setSingleTranslation(e.target.value)}
        className="text-field"
      />

      <ReactQuill
        theme="snow"
        value={longTranslation}
        onChange={setLongTranslation}
        placeholder="Enter detailed translation and notes here..."
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
    </Box>
  );
}

export default InputForm;

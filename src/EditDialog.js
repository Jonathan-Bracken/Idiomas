import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Select, MenuItem, InputLabel, TextField, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles
import DOMPurify from 'dompurify'; // To sanitize the HTML input
import { updateEntry } from './dataStorage';
import ResponsiveVoiceLoader from './ResponsiveVoiceLoader'; // Ensure this is correctly imported

function EditDialog({ entry, open, onClose, onReload }) {
  const [editedCategory, setEditedCategory] = useState(entry.category || 'None');
  const [editedShortTranslation, setEditedShortTranslation] = useState(entry.singleTranslation);
  const [editedLongTranslation, setEditedLongTranslation] = useState(entry.longTranslation);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const categories = ['None', 'Verbs', 'Adjectives', 'Family', 'Sport', 'Food', 'Clothes', 'Travel', 'Work', 'Home', 'Animals', 'Numbers', 'Colours', 'Time'];

  useEffect(() => {
    if (isScriptLoaded && typeof window.responsiveVoice !== 'undefined') {
      console.log('ResponsiveVoice loaded and ready for use');
    }
  }, [isScriptLoaded]);

  const handleSaveEdits = () => {
    const sanitizedTranslation = DOMPurify.sanitize(editedLongTranslation); // Sanitize the long translation

    const updatedEntry = {
      ...entry,
      category: editedCategory,
      singleTranslation: editedShortTranslation,
      longTranslation: sanitizedTranslation,
    };

    updateEntry(updatedEntry);
    onReload();
    onClose();
  };

  const speakTranslation = () => {
    if (isScriptLoaded && typeof window.responsiveVoice !== 'undefined') {
      const languageMap = {
        Spanish: 'Spanish Female',
        French: 'French Female',
        German: 'Deutsch Female',
      };
      const selectedVoice = languageMap[entry.learningLanguage] || 'UK English Female';
      window.responsiveVoice.speak(editedShortTranslation, selectedVoice);
    } else {
      console.error('ResponsiveVoice is not loaded or script failed to load');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        {/* Display the language */}
        <Typography variant="h6">Language: {entry.learningLanguage}</Typography>

        {/* Short translation editable field */}
        <TextField
          fullWidth
          margin="normal"
          label="Single Word/Phrase Translation"
          variant="outlined"
          value={editedShortTranslation}
          onChange={(e) => setEditedShortTranslation(e.target.value)}
          className="text-field"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Use ReactQuill for editing the long description */}
        <ReactQuill
          theme="snow"
          value={editedLongTranslation}
          onChange={setEditedLongTranslation}
          placeholder="Edit detailed translation and notes..."
          className="text-field"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSaveEdits} color="primary">Save Changes</Button>
        <Button onClick={speakTranslation} color="primary" disabled={!isScriptLoaded}>
          Hear Translation
        </Button>
      </DialogActions>
      {/* Load the responsiveVoice script */}
      <ResponsiveVoiceLoader onLoad={setIsScriptLoaded} />
    </Dialog>
  );
}

export default EditDialog;
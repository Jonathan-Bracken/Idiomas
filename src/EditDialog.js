import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles
import DOMPurify from 'dompurify'; // To sanitize the HTML input
import { updateEntry } from './dataStorage';

function EditDialog({ entry, open, onClose, onReload }) {
  const [editedCategory, setEditedCategory] = useState(entry.category || 'None');
  const [editedLongTranslation, setEditedLongTranslation] = useState(entry.longTranslation);

  const categories = ['None', 'Verbs', 'Adjectives', 'Family', 'Sport', 'Food', 'Clothes', 'Travel', 'Work', 'Home', 'Animals', 'Numbers', 'Colours', 'Time'];

  const handleSaveEdits = () => {
    const sanitizedTranslation = DOMPurify.sanitize(editedLongTranslation); // Sanitize the long translation

    const updatedEntry = {
      ...entry,
      category: editedCategory,
      longTranslation: sanitizedTranslation,
    };

    updateEntry(updatedEntry);
    onReload();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
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
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog;

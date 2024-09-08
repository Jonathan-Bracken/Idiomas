import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit'; // Edit button for editing words
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { getAllEntriesByLanguage, deleteEntry, updateEntry, saveEntry } from './dataStorage';

function WordTable({ setMode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [wordTable, setWordTable] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [importFileName, setImportFileName] = useState(''); // For import file name
  const [editMode, setEditMode] = useState(false); // To track if editing
  const [editedCategory, setEditedCategory] = useState(''); // For editing category
  const [editedLongTranslation, setEditedLongTranslation] = useState(''); // For editing long translation

  const categories = ['None', 'Verbs', 'Adjectives', 'Family', 'Sport', 'Food', 'Travel', 'Work', 'Numbers', 'Colors']; // Example categories
  const languages = ['Spanish', 'French', 'German']; // Dropdown options for languages

  const handleWordTableLoad = () => {
    const entries = selectedLanguage 
      ? getAllEntriesByLanguage(selectedLanguage)
      : JSON.parse(localStorage.getItem('languageEntries')) || [];
    
    const filteredEntries = selectedCategory 
      ? entries.filter(entry => entry.category === selectedCategory)
      : entries;

    setWordTable(filteredEntries);
  };

  const handleDeleteEntry = (entry) => {
    if (window.confirm(`Are you sure you want to delete the word "${entry.englishWord}"?`)) {
      deleteEntry(entry);
      handleWordTableLoad();
    }
  };

  const handleResetScore = (entry) => {
    const updatedEntry = {
      ...entry,
      points: 0,
    };
    updateEntry(updatedEntry);
    handleWordTableLoad();
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setEditedCategory(entry.category || 'None');
    setEditedLongTranslation(entry.longTranslation);
    setEditMode(true);
  };

  const handleCloseDetails = () => {
    setSelectedEntry(null);
    setEditMode(false);
  };

  const handleSaveEdits = () => {
    const updatedEntry = {
      ...selectedEntry,
      category: editedCategory,
      longTranslation: DOMPurify.sanitize(editedLongTranslation),
    };
    updateEntry(updatedEntry);
    handleWordTableLoad();
    handleCloseDetails();
  };

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedEntries = [...wordTable].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setSortConfig({ key, direction });
    setWordTable(sortedEntries);
  };

  // Export words to a JSON file
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(wordTable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedLanguage || 'all_languages'}_words.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import words from a JSON file
  const handleImport = (event) => {
    const file = event.target.files[0];
    setImportFileName(file.name); // Show file name
    const reader = new FileReader();

    reader.onload = (e) => {
      const importedWords = JSON.parse(e.target.result);
      importedWords.forEach(word => {
        saveEntry(word); // Add each imported word to the storage
      });
      handleWordTableLoad(); // Reload the word table after importing
    };

    reader.readAsText(file);
  };

  return (
    <Box>
      {/* Dropdown for selecting language */}
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

      {/* Dropdown for selecting category */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleWordTableLoad}
        className="button"
      >
        Load Word Table
      </Button>

      {/* Export Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleExport}
        className="button"
      >
        Export Words to File
      </Button>

      {/* Import Button */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        component="label"
        className="button"
      >
        Import Words from File
        <input type="file" hidden onChange={handleImport} />
      </Button>
      {importFileName && <Typography variant="body2" sx={{ marginTop: 1 }}>Selected file: {importFileName}</Typography>}

      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header" onClick={() => handleSort('englishWord')}>
                English Word
                {sortConfig.key === 'englishWord' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('singleTranslation')}>
                Translation
                {sortConfig.key === 'singleTranslation' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('category')}>
                Category
                {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
              </TableCell>
              {/* Conditionally render the Language column if no language is selected */}
              {!selectedLanguage && (
                <TableCell className="table-header" onClick={() => handleSort('learningLanguage')}>
                  Language
                  {sortConfig.key === 'learningLanguage' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
                </TableCell>
              )}
              <TableCell className="table-header" onClick={() => handleSort('points')}>
                Score
                {sortConfig.key === 'points' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('lastTested')}>
                Last Practiced
                {sortConfig.key === 'lastTested' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
              </TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wordTable.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.englishWord}</TableCell>
                <TableCell>{entry.singleTranslation}</TableCell>
                <TableCell>{entry.category || 'None'}</TableCell>
                {/* Conditionally render the Language cell if no language is selected */}
                {!selectedLanguage && <TableCell>{entry.learningLanguage}</TableCell>}
                <TableCell>{entry.points}</TableCell>
                <TableCell>{entry.lastTested ? new Date(entry.lastTested).toLocaleDateString() : 'Never'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditEntry(entry)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEntry(entry)} color="error">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleResetScore(entry)} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={() => setMode('input')}
        className="button"
      >
        Add to Dictionary
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={() => setMode('learning')}
        className="button"
      >
        Start Learning
      </Button>

      {/* Edit Dialog */}
      {editMode && selectedEntry && (
        <Dialog open={editMode} onClose={handleCloseDetails}>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogContent>
            <Typography variant="h6">English Word: {selectedEntry.englishWord}</Typography>
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
            <TextField
              fullWidth
              margin="normal"
              label="Longer Translation and Notes"
              multiline
              rows={4}
              variant="outlined"
              value={editedLongTranslation}
              onChange={(e) => setEditedLongTranslation(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails} color="secondary">Cancel</Button>
            <Button onClick={handleSaveEdits} color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default WordTable;

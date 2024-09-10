import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, MenuItem, Select, FormControl, InputLabel, Pagination, Button, TextField } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import WordTableRow from './WordTableRow';
import { getAllEntriesByLanguage, deleteEntry, updateEntry, saveEntry } from './dataStorage';

function WordTable({ setMode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('All'); // Default to "All"
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to "All"
  const [wordTable, setWordTable] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [importFileName, setImportFileName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedCategory, setEditedCategory] = useState('');
  const [editedLongTranslation, setEditedLongTranslation] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const categories = ['All', 'None', 'Verbs', 'Adjectives', 'Family', 'Sport', 'Food', 'Travel', 'Work', 'Numbers', 'Colours']; // Added "All"
  const languages = ['All', 'Spanish', 'French', 'German']; // Added "All"

  // Load all words on component mount
  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('languageEntries')) || [];
    setWordTable(entries);
  }, []); // Empty dependency array to run this effect once on mount

  const handleDeleteEntry = (entry) => {
    if (window.confirm(`Are you sure you want to delete the word "${entry.englishWord}"?`)) {
      deleteEntry(entry);
      setWordTable(prevTable => prevTable.filter(e => e !== entry));
    }
  };

  const handleResetScore = (entry) => {
    const updatedEntry = {
      ...entry,
      points: 0,
    };
    updateEntry(updatedEntry);
    setWordTable(prevTable => prevTable.map(e => e === entry ? updatedEntry : e));
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
    setWordTable(prevTable => prevTable.map(e => e === selectedEntry ? updatedEntry : e));
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

  // Pagination handling
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const filteredEntries = wordTable
    .filter(entry => selectedLanguage === 'All' || entry.learningLanguage === selectedLanguage)
    .filter(entry => selectedCategory === 'All' || entry.category === selectedCategory);

  const displayedRows = filteredEntries.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Export words to a JSON file
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(wordTable, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedLanguage === 'All' ? 'all_languages' : selectedLanguage}_words.json`;
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
      setWordTable(importedWords); // Set the imported words to the table
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
              {selectedCategory === 'All' && (
                <TableCell className="table-header" onClick={() => handleSort('category')}>
                  Category
                  {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />)}
                </TableCell>
              )}
              {!selectedLanguage || selectedLanguage === 'All' && (
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
              <TableCell className="table-header"> {/* Blank Header for Actions */}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((entry, index) => (
              <WordTableRow
                key={index}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onReset={handleResetScore}
                showLanguage={selectedLanguage === 'All'}  // Show language if "All" is selected
                showCategory={selectedCategory === 'All'}  // Show category if "All" is selected
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredEntries.length / rowsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />

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

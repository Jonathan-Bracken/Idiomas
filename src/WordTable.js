import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, MenuItem, Select, FormControl, InputLabel, Pagination, Button, Typography, TextField } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import WordTableRow from './WordTableRow';
import EditDialog from './EditDialog'; // Import EditDialog
import { deleteEntry, updateEntry, saveEntry } from './dataStorage';

function WordTable() {
  const [selectedLanguage, setSelectedLanguage] = useState('All'); // Default to "All"
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to "All"
  const [englishFilter, setEnglishFilter] = useState(''); // Default to "All"
  const [translationFilter, setTranslationFilter] = useState(''); // Default to "All"
  const [wordTable, setWordTable] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [importFileName, setImportFileName] = useState('');
  const [editMode, setEditMode] = useState(false);

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
    setSelectedEntry(entry); // Set the entry to edit
    setEditMode(true);       // Show the edit dialog
  };

  const handleCloseDetails = () => {
    setSelectedEntry(null);
    setEditMode(false);
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
    .filter(entry => selectedCategory === 'All' || entry.category === selectedCategory)
    .filter(entry => entry.englishWord.toLowerCase().includes(englishFilter.toLowerCase())) // Filter by English word
    .filter(entry => entry.singleTranslation.toLowerCase().includes(translationFilter.toLowerCase())); // Filter by Translation;

  const displayedRows = filteredEntries.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Export words to a JSON file without 'longTranslation'
const handleExport = () => {
  // Create a copy of the word table with 'longTranslation' excluded
  const exportData = wordTable.map(word => {
    const { longTranslation, ...rest } = word; // Exclude longTranslation
    return rest;
  });

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedLanguage === 'All' ? 'all_languages' : selectedLanguage}_words.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Import words from a JSON file without 'longTranslation' and merge with existing table, with overwrite logic based on lastTested
const handleImport = (event) => {
  const file = event.target.files[0];
  setImportFileName(file.name); // Show file name
  const reader = new FileReader();

  reader.onload = (e) => {
    const importedWords = JSON.parse(e.target.result);
    const existingWords = JSON.parse(localStorage.getItem('languageEntries')) || []; // Load existing words from localStorage

    // Create a map for quick lookup of existing words (e.g., by 'englishWord' and 'learningLanguage')
    const existingWordsMap = new Map();
    existingWords.forEach(word => {
      const key = `${word.englishWord.toLowerCase()}_${word.learningLanguage.toLowerCase()}`;
      existingWordsMap.set(key, word);
    });

    // Iterate over imported words and update the map if conditions are met
    importedWords.forEach(word => {
      const key = `${word.englishWord.toLowerCase()}_${word.learningLanguage.toLowerCase()}`;
      const existingWord = existingWordsMap.get(key);

      if (existingWord) {
        // Word already exists, check if we should overwrite based on 'lastTested'
        const importedLastTested = new Date(word.lastTested);
        const existingLastTested = new Date(existingWord.lastTested);

        if (importedLastTested > existingLastTested) {
          // Overwrite existing word with the imported one if it has a more recent 'lastTested'
          const { longTranslation, ...rest } = word; // Exclude longTranslation from imported words
          existingWordsMap.set(key, { ...existingWord, ...rest }); // Update the existing word
        }
      } else {
        // New word, add 'points' and 'lastTested'
        const newWord = {
          ...word,
          points: word.points || 0, // Ensure points are initialized
          lastTested: word.lastTested || null, // Ensure lastTested is initialized
        };
        const { longTranslation, ...rest } = newWord; // Exclude longTranslation from new words
        existingWordsMap.set(key, rest); // Add new word to the map
      }
    });

    // Convert map back to an array
    const mergedWords = Array.from(existingWordsMap.values());

    // Save merged words back to localStorage and update the table
    localStorage.setItem('languageEntries', JSON.stringify(mergedWords)); // Store merged words in localStorage
    setWordTable(mergedWords); // Update the state with the merged word table
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

      {/* TextBox for filtering by English word */}
      <TextField
        fullWidth
        margin="normal"
        label="Filter by English Word"
        variant="outlined"
        value={englishFilter}
        onChange={(e) => setEnglishFilter(e.target.value)}
      />

      {/* TextBox for filtering by Translation */}
      <TextField
        fullWidth
        margin="normal"
        label="Filter by Translation"
        variant="outlined"
        value={translationFilter}
        onChange={(e) => setTranslationFilter(e.target.value)}
      />

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

      {/* Edit Dialog */}
      {editMode && selectedEntry && (
        <EditDialog
          entry={selectedEntry}
          open={editMode}
          onClose={handleCloseDetails}
          onReload={() => setWordTable([...wordTable])} // Reload data after saving
        />
      )}
    </Box>
  );
}

export default WordTable;

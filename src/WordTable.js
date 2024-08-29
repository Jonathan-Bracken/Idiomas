import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllEntriesByLanguage, deleteEntry, updateEntry, saveEntry } from './dataStorage';

function WordTable({ setMode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [wordTable, setWordTable] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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
    deleteEntry(entry);
    handleWordTableLoad();
  };

  const handleResetScore = (entry) => {
    const updatedEntry = {
      ...entry,
      points: 0,
    };
    updateEntry(updatedEntry);
    handleWordTableLoad();
  };

  const handleViewDetails = (entry) => {
    setSelectedEntry(entry);
  };

  const handleCloseDetails = () => {
    setSelectedEntry(null);
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

      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header" onClick={() => handleSort('englishWord')}>English Word</TableCell>
              <TableCell className="table-header" onClick={() => handleSort('singleTranslation')}>Translation</TableCell>
              <TableCell className="table-header" onClick={() => handleSort('category')}>Category</TableCell>
              <TableCell className="table-header" onClick={() => handleSort('points')}>Score</TableCell>
              <TableCell className="table-header" onClick={() => handleSort('lastTested')}>Last Practiced</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wordTable.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.englishWord}</TableCell>
                <TableCell>{entry.singleTranslation}</TableCell>
                <TableCell>{entry.category || 'None'}</TableCell>
                <TableCell>{entry.points}</TableCell>
                <TableCell>{entry.lastTested ? new Date(entry.lastTested).toLocaleDateString() : 'Never'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(entry)} color="primary">
                    <VisibilityIcon />
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
        Switch to Input Mode
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

      {/* Details Dialog */}
      <Dialog open={Boolean(selectedEntry)} onClose={handleCloseDetails}>
        <DialogTitle>Translation Details</DialogTitle>
        <DialogContent>
          {selectedEntry && (
            <Box>
              <Typography variant="h6">English Word:</Typography>
              <Typography>{selectedEntry.englishWord}</Typography>
              <Typography variant="h6" sx={{ marginTop: 2 }}>Single Translation:</Typography>
              <Typography>{selectedEntry.singleTranslation}</Typography>
              <Typography variant="h6" sx={{ marginTop: 2 }}>Category:</Typography>
              <Typography>{selectedEntry.category || 'None'}</Typography>
              <Typography variant="h6" sx={{ marginTop: 2 }}>Longer Translation and Notes:</Typography>
              {selectedEntry.longTranslation.split('\n').map((line, index) => (
                <Typography key={index} variant="body1">{line}</Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WordTable;

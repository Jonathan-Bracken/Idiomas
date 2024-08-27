import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllEntriesByLanguage, deleteEntry, updateEntry } from './dataStorage';

function WordTable({ setMode }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [wordTable, setWordTable] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const handleWordTableLoad = () => {
    const entries = getAllEntriesByLanguage(selectedLanguage);
    setWordTable(entries);
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

  const renderWithLineBreaks = (text) => {
    return text.split('\n').map((line, index) => (
      <Typography key={index} variant="body1">
        {line}
      </Typography>
    ));
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
      <Button
        variant="contained"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={handleWordTableLoad}
        className="button"
      >
        Load Word Table
      </Button>
      <TableContainer sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">English Word</TableCell>
              <TableCell className="table-header">Translation</TableCell>
              <TableCell className="table-header">Score</TableCell>
              <TableCell className="table-header">Last Practiced</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wordTable.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.englishWord}</TableCell>
                <TableCell>{entry.singleTranslation}</TableCell>
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
              <Typography variant="h6" sx={{ marginTop: 2 }}>Longer Translation and Notes:</Typography>
              {renderWithLineBreaks(selectedEntry.longTranslation)}
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

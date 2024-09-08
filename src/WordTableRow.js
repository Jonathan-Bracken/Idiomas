import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import { deleteEntry, updateEntry } from './dataStorage';

function WordTableRow({ entry, onEdit, onReload }) {
  const handleDeleteEntry = () => {
    if (window.confirm(`Are you sure you want to delete the word "${entry.englishWord}"?`)) {
      deleteEntry(entry);
      onReload();
    }
  };

  const handleResetScore = () => {
    const updatedEntry = {
      ...entry,
      points: 0,
    };
    updateEntry(updatedEntry);
    onReload();
  };

  return (
    <TableRow>
      <TableCell>{entry.englishWord}</TableCell>
      <TableCell>{entry.singleTranslation}</TableCell>
      <TableCell>{entry.category || 'None'}</TableCell>
      <TableCell>{entry.learningLanguage}</TableCell>
      <TableCell>{entry.points}</TableCell>
      <TableCell>{entry.lastTested ? new Date(entry.lastTested).toLocaleDateString() : 'Never'}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(entry)} color="primary">
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDeleteEntry} color="error">
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={handleResetScore} color="primary">
          <RefreshIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default WordTableRow;

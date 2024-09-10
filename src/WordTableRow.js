import React from 'react';
import { TableCell, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';

function WordTableRow({ entry, onEdit, onDelete, onReset }) {
  return (
    <TableRow>
      <TableCell>{entry.englishWord}</TableCell>
      <TableCell>{entry.singleTranslation}</TableCell>
      <TableCell>{entry.category || 'None'}</TableCell>
      <TableCell>{entry.learningLanguage}</TableCell>
      <TableCell>{entry.points}</TableCell>
      <TableCell>{entry.lastTested ? new Date(entry.lastTested).toLocaleDateString() : 'Never'}</TableCell>
      <TableCell>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}> {/* Flexbox container */}
          <IconButton onClick={() => onEdit(entry)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(entry)} color="error">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => onReset(entry)} color="primary">
            <RefreshIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default WordTableRow;

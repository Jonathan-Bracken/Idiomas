import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';

function TableActions({ onEdit, onDelete, onReset }) {
  return (
    <>
      <IconButton onClick={onEdit} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={onDelete} color="error">
        <DeleteIcon />
      </IconButton>
      <IconButton onClick={onReset} color="primary">
        <RefreshIcon />
      </IconButton>
    </>
  );
}

export default TableActions;

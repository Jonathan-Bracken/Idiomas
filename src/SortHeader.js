import React from 'react';
import { TableHead, TableRow, TableCell } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

function SortHeader({ sortConfig, onSort }) {
  const headers = [
    { label: 'English Word', key: 'englishWord' },
    { label: 'Translation', key: 'singleTranslation' },
    { label: 'Category', key: 'category' },
    { label: 'Language', key: 'learningLanguage' },
    { label: 'Score', key: 'points' },
    { label: 'Last Practiced', key: 'lastTested' }
  ];

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowDropUp /> : <ArrowDropDown />;
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => (
          <TableCell
            key={header.key}
            onClick={() => onSort(header.key)}
            style={{ cursor: 'pointer' }}
          >
            {header.label} {renderSortIcon(header.key)}
          </TableCell>
        ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}

export default SortHeader;

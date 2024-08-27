import React, { useState } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import InputForm from './InputForm';
import LearningMode from './LearningMode';
import WordTable from './WordTable';
import './App.css';

function App() {
  const [mode, setMode] = useState('input'); // 'input', 'learning', or 'wordTable'

  return (
    <Container maxWidth="md" className="main-container">
      <Paper elevation={6} className="main-paper">
        <Typography variant="h4" className="header-text" gutterBottom>
          {mode === 'input'
            ? 'Language Learning - Input Mode'
            : mode === 'learning'
            ? 'Language Learning - Learning Mode'
            : 'Language Learning - Word Table'}
        </Typography>

        <Box>
          {mode === 'input' && <InputForm setMode={setMode} />}
          {mode === 'learning' && <LearningMode setMode={setMode} />}
          {mode === 'wordTable' && <WordTable setMode={setMode} />}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;

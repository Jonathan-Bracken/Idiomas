import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import InputForm from './InputForm';
import LearningMode from './LearningMode';
import WordTable from './WordTable';
import './App.css';

function App() {
  const [mode, setMode] = useState('input'); // 'input', 'learning', or 'wordTable'

  return (
    <Container maxWidth="lg" className="main-container" sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '250px', padding: '20px', backgroundColor: '#f4f4f4' }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: 2 }}
          onClick={() => setMode('input')}
        >
          Add to Dictionary
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ marginBottom: 2 }}
          onClick={() => setMode('learning')}
        >
          Start Learning
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => setMode('wordTable')}
        >
          View Dictionary
        </Button>
      </Box>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Paper elevation={6} className="main-paper" sx={{ padding: '20px' }}>
          <Typography variant="h4" className="header-text" gutterBottom>
            {mode === 'input'
              ? 'Add to Dictionary'
              : mode === 'learning'
              ? 'Learning Mode'
              : 'Dictionary'}
          </Typography>

          <Box>
            {mode === 'input' && <InputForm setMode={setMode} />}
            {mode === 'learning' && <LearningMode setMode={setMode} />}
            {mode === 'wordTable' && <WordTable setMode={setMode} />}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
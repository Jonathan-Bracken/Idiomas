import React, { useState } from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import InputForm from './InputForm';
import LearningMode from './LearningMode';
import WordTable from './WordTable';
import ResponsiveVoiceLoader from './ResponsiveVoiceLoader';
import './App.css';

function App() {
  const [mode, setMode] = useState('input'); // 'input', 'learning', or 'wordTable'
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const handleScriptLoad = (loaded) => {
    setIsScriptLoaded(loaded); // Update the state when script is loaded or failed
  };

  return (
    <Container maxWidth="md" className="main-container">
      {/* Load the ResponsiveVoice.js script globally */}
      <ResponsiveVoiceLoader onLoad={handleScriptLoad} />

      <Paper elevation={6} className="main-paper">
        <Typography variant="h4" className="header-text" gutterBottom>
          {mode === 'input'
            ? 'Add to Dictionary' // Updated title here
            : mode === 'learning'
            ? 'Learning Mode'
            : 'Dictionary'}
        </Typography>

        <Box>
          {mode === 'input' && <InputForm setMode={setMode} />}
          {mode === 'learning' && <LearningMode setMode={setMode} isScriptLoaded={isScriptLoaded} />}
          {mode === 'wordTable' && <WordTable setMode={setMode} />}
        </Box>
      </Paper>
    </Container>
  );
}

export default App;

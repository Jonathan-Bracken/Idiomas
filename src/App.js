import React, { useState } from 'react';
import { Container, Paper, Typography, Box, Button, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // For the hamburger icon
import InputForm from './InputForm';
import LearningMode from './LearningMode';
import WordTable from './WordTable';
import './App.css';

function App() {
  const [mode, setMode] = useState('input'); // 'input', 'learning', or 'wordTable'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For toggling sidebar

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container maxWidth="lg" className="main-container" sx={{ display: 'flex', height: '100vh' }}>
      {/* Hamburger Icon (visible on mobile) */}
      <IconButton
        sx={{ display: { xs: 'block', md: 'none' }, position: 'absolute', top: 10, left: 10 }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar (Drawer on mobile) */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{ display: { xs: 'block', md: 'none' } }} // Show as drawer on mobile, hide on larger screens
      >
        <Box sx={{ width: '250px', padding: '20px', backgroundColor: '#f4f4f4' }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ marginBottom: 2 }}
            onClick={() => { setMode('input'); toggleSidebar(); }} // Close drawer on click
          >
            Add to Dictionary
          </Button>
          <Button
            variant="contained"
            fullWidth
            sx={{ marginBottom: 2 }}
            onClick={() => { setMode('learning'); toggleSidebar(); }}
          >
            Start Learning
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => { setMode('wordTable'); toggleSidebar(); }}
          >
            View Dictionary
          </Button>
        </Box>
      </Drawer>

      {/* Permanent Sidebar for larger screens */}
      <Box
        sx={{
          width: '250px',
          padding: '20px',
          backgroundColor: '#f4f4f4',
          display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
        }}
      >
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
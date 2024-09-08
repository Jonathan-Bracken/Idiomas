import { useEffect } from 'react';

const ResponsiveVoiceLoader = ({ onLoad }) => {
  useEffect(() => {
    const apiKey = process.env.REACT_APP_RESPONSIVEVOICE_API_KEY;
    
    // Check if the script is already loaded
    const existingScript = document.querySelector(`script[src*="responsivevoice"]`);
    if (existingScript) {
      console.log('ResponsiveVoice.js script is already loaded');
      if (onLoad) onLoad(true);
    } else {
      console.log('Loading ResponsiveVoice.js script...');
      const script = document.createElement('script');
      script.src = `https://code.responsivevoice.org/responsivevoice.js?key=${apiKey}`;
      script.async = true;
      script.onload = () => {
        console.log('ResponsiveVoice.js script loaded successfully');
        if (onLoad) onLoad(true);
      };
      script.onerror = () => {
        console.error('Failed to load ResponsiveVoice.js script');
        if (onLoad) onLoad(false);
      };
      document.body.appendChild(script);
    }

    return () => {
      // Ensure the script is not removed to avoid re-loading
      console.log('Cleanup function called, but we will NOT remove the script.');
    };
  }, [onLoad]);

  return null; // This component does not render anything
};

export default ResponsiveVoiceLoader;

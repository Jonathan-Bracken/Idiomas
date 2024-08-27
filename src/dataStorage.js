export const saveEntry = (entry) => {
    const storedEntries = JSON.parse(localStorage.getItem('languageEntries')) || [];
    const entryWithStats = {
      ...entry,
      points: 0,
      lastTested: null,
    };
    storedEntries.push(entryWithStats);
    localStorage.setItem('languageEntries', JSON.stringify(storedEntries));
  };
  
  export const getEntriesByLanguage = (language) => {
    const storedEntries = JSON.parse(localStorage.getItem('languageEntries')) || [];
    const now = new Date();
  
    return storedEntries.filter(entry => {
      if (entry.learningLanguage.toLowerCase() !== language.toLowerCase()) {
        return false;
      }
  
      if (!entry.lastTested) {
        return true;
      }
  
      const lastTestedDate = new Date(entry.lastTested);
      const daysSinceLastTested = Math.floor((now - lastTestedDate) / (1000 * 60 * 60 * 24));
  
      return daysSinceLastTested >= entry.points; // only show the word if the required number of days has passed
    });
  };
  
  export const getAllEntriesByLanguage = (language) => {
    const storedEntries = JSON.parse(localStorage.getItem('languageEntries')) || [];
  
    return storedEntries.filter(entry => 
      entry.learningLanguage.toLowerCase() === language.toLowerCase()
    );
  };
  
  export const updateEntry = (entry) => {
    const storedEntries = JSON.parse(localStorage.getItem('languageEntries')) || [];
    const index = storedEntries.findIndex(e => 
      e.englishWord === entry.englishWord && e.learningLanguage === entry.learningLanguage
    );
  
    if (index !== -1) {
      storedEntries[index] = entry;
      localStorage.setItem('languageEntries', JSON.stringify(storedEntries));
    }
  };
  
  export const deleteEntry = (entry) => {
    let storedEntries = JSON.parse(localStorage.getItem('languageEntries')) || [];
    storedEntries = storedEntries.filter(e => 
      e.englishWord !== entry.englishWord || e.learningLanguage !== entry.learningLanguage
    );
    localStorage.setItem('languageEntries', JSON.stringify(storedEntries));
  };
  
const analyzeText = async (text) => {
  // Here you can integrate with an AI service like OpenAI
  // For now, using simple keyword matching
  const moods = {
    motivational: ['achieve', 'goal', 'inspire', 'success', 'motivation'],
    funny: ['laugh', 'joke', 'humor', 'fun', 'happy'],
    romantic: ['love', 'heart', 'relationship', 'romance', 'partner'],
    faith: ['believe', 'faith', 'god', 'spirit', 'pray']
  };

  let detectedMood = null;
  let confidence = 0;

  for (const [mood, keywords] of Object.entries(moods)) {
    const matches = keywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    
    if (matches > confidence) {
      confidence = matches;
      detectedMood = mood;
    }
  }

  return {
    mood: detectedMood || 'general',
    confidence: confidence / 5, // Normalize confidence
    quoteSuggestion: detectedMood ? `/quotes/${detectedMood}` : null
  };
};

module.exports = { analyzeText };
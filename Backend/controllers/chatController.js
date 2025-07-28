const Groq = require('groq-sdk');
const Chat = require('../models/chat');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const chatController = {
    async askQuestion(req, res) {
        try {
            if (!req.user?._id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { question, sessionId } = req.body;
            const userId = req.user._id; 
            
            if (!question || !sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Question and session ID are required'
                });
            }

            let chat = await Chat.findOne({ sessionId, userId }); 
            if (!chat) {
                chat = new Chat({
                    sessionId,
                    userId, 
                    messages: []
                });
            }

            chat.messages.push({
                role: 'user',
                content: question,
                timestamp: new Date()
            });

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "You are an AI quote assistant that analyzes user mood and suggests relevant quote categories. At the first time when greeting, just greet naturally and ask about their day. Follow these steps:1. **Mood Analysis**: First, analyze the user's emotional state from their message (happy, sad, stressed, confused, excited, etc.)2. **Category Suggestion**: After analyzing their mood, suggest 2-3 relevant quote categories from: motivational, funny, romantic, faith, inspirational, wisdom, success, friendship, life lessons, self-care, adventure, creativity.3. **Ask Permission**: DO NOT directly provide quotes. Instead, ask Would you like to see some [category] quotes? or I can share some [category] quotes that might help. Interested?4. **Wait for Confirmation**: Only provide actual quotes after the user explicitly says yes or requests them.5. **Response Format**: a.Acknowledge their mood with empathyb.Suggest appropriate categories based on their emotional statec.Ask if they'd like quotes from those categoriesd.Keep initial responses conversational and supportive. Example: I can sense you're feeling [mood]. Based on that, I think [category1] or [category2] quotes might be helpful. Would you like to see some quotes from either of these categories? .Never dump quotes immediately - always get user permission first."
                    },
                    ...chat.messages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                ],
                model: "compound-beta-mini",
                temperature: 0.7,
                max_tokens: 256
            });

            const aiResponse = completion.choices[0]?.message?.content || 
                "I apologize, but I couldn't generate a response.";

            chat.messages.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            });

            await chat.save();

            const suggestion = extractQuoteSuggestion(aiResponse);

            res.json({
                success: true,
                answer: aiResponse,
                suggestion,
                history: chat.messages
            });

        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    },

    async getChatHistory(req, res) {
        try {
            if (!req.user?._id) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const { sessionId } = req.params;
            
            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'Session ID is required'
                });
            }

            const chat = await Chat.findOne({
                userId: req.user._id,
                sessionId: sessionId
            }).sort({ 'messages.timestamp': -1 }); 

            if (!chat) {
                return res.json({
                    success: true,
                    history: []
                });
            }

            res.json({
                success: true,
                history: chat.messages,
                sessionId: chat.sessionId
            });
        } catch (error) {
            console.error('Chat history error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve chat history'
            });
        }
    }
};

function extractQuoteSuggestion(response) {
  const categories = ['motivational', 'funny', 'romantic', 'faith'];
  const lowerResponse = response.toLowerCase();
  
  for (const category of categories) {
    if (lowerResponse.includes(category)) {
      return `/quotes/${category}`;
    }
  }
  return null;
}

module.exports = chatController;
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,             
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


module.exports = app;


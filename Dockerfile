# Multi-stage build
# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
# Fix API URL to use relative paths (works because we serve from same origin)
RUN grep -lR "http://localhost:8081" src | xargs sed -i 's|http://localhost:8081||g'
RUN npm run build

# Stage 2: Setup the Backend and Serve Frontend
FROM node:20-alpine
WORKDIR /app

# Copy Backend package files (from the project root)
COPY package*.json ./
# The root package.json is missing some critical dependencies that are used in the code.
# We install them explicitly to ensure the app runs.
# We use express@4 to avoid routing breaking changes in Express 5.
RUN npm install && npm install express@4 dotenv cookie-parser cors

# Copy Backend source code
COPY Backend/ ./Backend/

# Copy the built frontend to a folder the backend can serve
COPY --from=frontend-builder /frontend/build ./public

# Hugging Face Spaces run on port 7860 by default
ENV PORT=7860
ENV NODE_ENV=production

# Add logic to serve static files and change port without modifying local files
RUN sed -i 's/const PORT = process.env.PORT || 8081;/const PORT = process.env.PORT || 7860;/g' Backend/index.js && \
    sed -i "s|const express = require('express');|const express = require('express');\nconst path = require('path');|g" Backend/index.js && \
    sed -i "s|app.use('/api/chat', chatRoutes);|app.use('/api/chat', chatRoutes);\napp.use(express.static(path.join(__dirname, '../public')));\napp.get('*', (req, res) => {\n  res.sendFile(path.join(__dirname, '../public', 'index.html'));\n});|g" Backend/index.js

EXPOSE 7860

CMD ["node", "Backend/index.js"]

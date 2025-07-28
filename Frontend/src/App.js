import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/Landing/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Chat from './components/Chat/Chat';
import MotivationalQuotes from './components/Quotes/MotivationalQuotes';
import FunnyQuotes from './components/Quotes/FunnyQuotes';
import RomanticQuotes from './components/Quotes/RomanticQuotes';
import FaithQuotes from './components/Quotes/FaithQuotes';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
                 <Chat /> 
              </ProtectedRoute>
            } />
            <Route path="/quotes/motivational" element={
              <ProtectedRoute>
                <MotivationalQuotes />
                 <Chat /> 
              </ProtectedRoute>
            } />
            <Route path="/quotes/funny" element={
              <ProtectedRoute>
                <FunnyQuotes />
                 <Chat /> 
              </ProtectedRoute>
            } />
            <Route path="/quotes/romantic" element={
              <ProtectedRoute>
                <RomanticQuotes />
                 <Chat /> 
              </ProtectedRoute>
            } />
            <Route path="/quotes/faith" element={
              <ProtectedRoute>
                <FaithQuotes />
                 <Chat /> 
              </ProtectedRoute>
            } />
            <Route path="/" element={<LandingPage />} />
          </Routes>          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

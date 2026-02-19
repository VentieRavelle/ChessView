import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Home from './pages/landing/Home'; 
import Register from './pages/auth/Register'; 
import Login from './pages/auth/Login'; 
import Dashboard from './pages/Dashboard/Dashboard'; 
import Profile from './pages/Profile/Profile'; 
import Settings from './pages/Settings/Settings'; 
import UserProfile from './pages/Profile/OtherProfile'; 
import UsersSearch from './pages/Profile/UsersSearch';
import FriendsList from './pages/Profile/FriendsList'; 
import GamePage from './pages/Game/GamePage'; 
import Shop from './pages/Market/Shop'; 
import Tournaments from './pages/Game/Tournaments'; 
import Analysis from './pages/Game/Analysis'; 
import HistoryModal from './pages/Game/HistoryModal';
import NotFoundModal from './components/NotFoundModal'; 
import WaitingRoom from './pages/Game/WaitingRoom';
import Clubs
 from './pages/Clubs/Clubs';
const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/tournaments" element={<Tournaments />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/users" element={<UsersSearch onClose={() => navigate('/dashboard')} />} />
      <Route path="/friends" element={<FriendsList onClose={() => navigate('/dashboard')} />} />
      <Route path="/history" element={<HistoryModal isOpen={true} onClose={() => navigate('/dashboard')} />} />
      <Route path="/user/:userId" element={<UserProfile />} />
      <Route path="/game/:mode" element={<GamePage />} />
      <Route path="/waiting/:gameId" element={<WaitingRoom />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="*" element={<NotFoundModal />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
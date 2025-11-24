import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { UserProvider } from './context/UserContext';
import UserDashboard from './pages/dashboard';

// [INSTRUCTION_B] Placeholder Components for Dashboards (Replace with real pages later) [INSTRUCTION_E]
//const UserDashboard = () => <div className="p-10 text-2xl font-bold text-blue-600">User Dashboard - Welcome!</div>;
const AdminDashboard = () => <div className="p-10 text-2xl font-bold text-red-600">Admin Dashboard - System Overview</div>;

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes placeholders */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Default Redirect: Go to login if path is root */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all: Redirect to login for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import DashboardHome from './pages/dashboard/DashboardHome'; // Import trang mới
import AuthLayout from './components/layouts/AuthLayout';
import RootLayout from './components/layouts/RootLayout';
import MainLayout from './components/layouts/MainLayout';
import { UserProvider } from './context/UserContext';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* ĐÂY LÀ CHỖ ÁP DỤNG LAYOUT VÀ DASHBOARD */}
            <Route element={<MainLayout />}>
              {/* Khi vào /dashboard, nó sẽ được bọc bởi MainLayout (có Sidebar) */}
              <Route path="/dashboard" element={<DashboardHome />} />

              {/* Giữ lại các route cũ nhưng trỏ về cùng 1 DashboardHome cho thống nhất */}
              <Route path="/user/dashboard" element={<DashboardHome />} />
              <Route path="/admin/dashboard" element={<DashboardHome />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />

          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
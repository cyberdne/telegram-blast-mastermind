
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  
  const handleLogin = (username: string, role: 'admin' | 'user') => {
    setUsername(username);
    setRole(role);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setRole('user');
  };
  
  return (
    <div className="min-h-screen">
      {isLoggedIn ? (
        <Dashboard
          username={username}
          role={role}
          onLogout={handleLogout}
        />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Index;

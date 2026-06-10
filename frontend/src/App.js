import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/Login';
import AdminDashboard from './componentes/AdminDashboard';
import UserDashboard from './componentes/UserDashboard';
import UsuariosAdmin from './componentes/UsuariosAdmin';
import VeiculosAdmin from './componentes/VeiculosAdmin';
import TiposAdmin from './componentes/TiposAdmin';
import MultasAdmin from './componentes/MultasAdmin';

// Componente para proteger rotas administrativas
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const perfil = localStorage.getItem('user_profile')?.toLowerCase();

  if (!token || perfil !== 'admin') {
    // Se não for admin, redireciona para o login ou uma página de erro
    return <Navigate to="/" replace />;
  }

  return children;
};

// Componente para proteger rotas de usuários logados
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rota liberada apenas para Admin */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><UsuariosAdmin /></AdminRoute>} />
        <Route path="/admin/veiculos" element={<AdminRoute><VeiculosAdmin /></AdminRoute>} />
        <Route path="/admin/tipos" element={<AdminRoute><TiposAdmin /></AdminRoute>} />
        <Route path="/admin/multas" element={<AdminRoute><MultasAdmin /></AdminRoute>} />
        
        {/* Rota para usuários normais ou Admin */}
        <Route path="/painel" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
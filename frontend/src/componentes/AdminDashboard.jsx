import React, { useEffect, useState } from 'react';
import api from '../api';
import '../App.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pessoas: 0, veiculos: 0, multas: 0 });

  useEffect(() => {
    const carregarStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas", error);
      }
    };
    carregarStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">Admin</div>
        <nav>
          <a href="/admin/dashboard">Início</a>
          <a href="/admin/usuarios">Usuários</a>
          <a href="/admin/veiculos">Veículos</a>
          <a href="/admin/tipos">Tipos</a>
          <a href="/admin/multas">Multas</a>
          <button className="botao-danger" onClick={handleLogout} style={{marginTop: '20px'}}>Sair</button>
        </nav>
      </div>
      <div className="conteudo">
        <h1 className="titulo">Painel Administrativo</h1>
        <div className="grid">
          <div className="card-dashboard"><h2>{stats.pessoas}</h2><p>Usuários Cadastrados</p></div>
          <div className="card-dashboard"><h2>{stats.veiculos}</h2><p>Veículos Registrados</p></div>
          <div className="card-dashboard"><h2>{stats.multas}</h2><p>Total de Multas</p></div>
        </div>
      </div>
    </div>
  );
}
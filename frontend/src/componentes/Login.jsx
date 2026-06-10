import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      console.log('Login: Enviando credenciais para o controller:', { cpf, senha });

      // Chamada para o endpoint de login no backend
      const response = await api.post('/login', { cpf, senha });
      
      console.log('Login: Sucesso!', response.data);
      const { token, usuario } = response.data;
      const perfil = usuario.perfil.toLowerCase(); // Padroniza para comparar

      // Armazena dados de sessão
      localStorage.setItem('token', token);
      localStorage.setItem('user_profile', perfil); // 'admin' ou 'cidadao'
      localStorage.setItem('usuario', JSON.stringify(usuario)); // Salva para o MeuPainel

      // Redirecionamento baseado no perfil
      if (perfil === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/painel');
      }
    } catch (err) {
      // Tenta pegar a mensagem de erro específica vinda do backend
      const mensagemErro = err.response?.data?.erro || 'Erro ao conectar com o servidor.';
      setErro(mensagemErro);
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Gestão de Multas</h1>
        <p>Acesse sua conta</p>
        
        {erro && <p style={{ color: '#dc2626', fontSize: '14px' }}>{erro}</p>}
        
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
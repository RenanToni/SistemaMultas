import React, { useEffect, useState } from "react";
import api from "../api";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [idBusca, setIdBusca] = useState("");

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    cpf: "",
    pontos: "",
    senha: "",
    perfil: "CIDADAO"
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resposta = await api.get("/pessoas");
      setUsuarios(resposta.data);
    } catch (erro) { console.error(erro); }
  };

  const buscarPorId = async () => {
    if (!idBusca) {
      carregarDados();
      return;
    }
    try {
      const res = await api.get(`/pessoas/${idBusca}`);
      setUsuarios(res.data ? [res.data] : []);
    } catch (e) {
      setUsuarios([]);
    }
  };

  const prepararEdicao = (u) => {
    setNovoUsuario({ nome: u.nome, cpf: u.cpf, pontos: u.pontos, senha: u.senha, perfil: u.perfil });
    setEditando(u.idusuario);
  };

  async function cadastrar() {
    try {
      if (editando) {
        await api.put(`/pessoas/${editando}`, novoUsuario);
      } else {
        await api.post("/pessoas", novoUsuario);
      }
      setEditando(null);
      setNovoUsuario({ nome: "", cpf: "", pontos: "", senha: "", perfil: "CIDADAO" });
      carregarDados();
    } catch (erro) { console.error(erro); }
  }

  const excluir = async (id) => {
    if (window.confirm("Deseja excluir este usuário?")) {
      try {
        await api.delete(`/pessoas/${id}`);
        carregarDados();
      } catch (e) { alert("Erro ao excluir"); }
    }
  };

  const usuariosProcessados = React.useMemo(() => {
    let lista = [...usuarios];
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      lista = lista.filter(u => 
        u.nome.toLowerCase().includes(termo) || 
        u.cpf.toLowerCase().includes(termo)
      );
    }
    return lista;
  }, [usuarios, termoBusca]);

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">Admin</div>
        <nav><a href="/admin/dashboard">Voltar</a></nav>
      </div>
      <div className="conteudo">
        <h1>Gerenciar Usuários</h1>
        <div className="card">
          <h3>{editando ? "Editar Usuário" : "Novo Usuário"}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input className="input" placeholder="Nome" value={novoUsuario.nome} onChange={e => setNovoUsuario({...novoUsuario, nome: e.target.value})} />
            <input className="input" placeholder="CPF" value={novoUsuario.cpf} onChange={e => setNovoUsuario({...novoUsuario, cpf: e.target.value})} />
            <input className="input" placeholder="Pontos" type="number" value={novoUsuario.pontos} onChange={e => setNovoUsuario({...novoUsuario, pontos: e.target.value})} />
            <input className="input" placeholder="Senha" type="password" value={novoUsuario.senha} onChange={e => setNovoUsuario({...novoUsuario, senha: e.target.value})} />
            <select className="select" value={novoUsuario.perfil} onChange={e => setNovoUsuario({...novoUsuario, perfil: e.target.value})}>
              <option value="CIDADAO">Cidadão</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <button className="botao" onClick={cadastrar}>{editando ? "Atualizar" : "Cadastrar"}</button>
            {editando && (
              <button className="botao" style={{ background: '#64748b' }} 
                onClick={() => { setEditando(null); setNovoUsuario({ nome: "", cpf: "", pontos: "", senha: "", perfil: "CIDADAO" }); }}>Cancelar</button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input 
            className="input" 
            style={{ flex: 3 }}
            placeholder="🔍 Buscar por nome ou CPF..." 
            value={termoBusca} 
            onChange={e => setTermoBusca(e.target.value)} 
          />
          <input 
            className="input" 
            style={{ flex: 1 }}
            type="number"
            placeholder="🆔 ID..." 
            value={idBusca}
            onChange={e => setIdBusca(e.target.value)}
            onKeyUp={e => e.key === 'Enter' && buscarPorId()}
          />
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CPF</th>
              <th>Perfil</th>
              <th>Pontos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosProcessados.map(u => (
              <tr key={u.idusuario}>
                <td>{u.idusuario}</td>
                <td>{u.nome}</td>
                <td>{u.cpf}</td>
                <td>{u.perfil}</td>
                <td>{u.pontos}</td>
                <td>
                  <button className="botao" style={{ marginRight: '5px' }} onClick={() => prepararEdicao(u)}>Editar</button>
                  <button className="botao botao-danger" onClick={() => excluir(u.idusuario)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
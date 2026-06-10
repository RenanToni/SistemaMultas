import React, { useEffect, useState } from 'react';
import api from '../api';

export default function TiposAdmin() {
  const [tipos, setTipos] = useState([]);
  const [novoTipo, setNovoTipo] = useState({ tipo: "", preco: "", taxa: "", pontos: "" });
  const [editando, setEditando] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [idBusca, setIdBusca] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await api.get('/tipos');
      setTipos(response.data);
    } catch (e) {
      alert("Erro ao carregar tipos");
    }
  };

  const buscarPorId = async () => {
    if (!idBusca) {
      carregarDados();
      return;
    }
    try {
      const res = await api.get(`/tipos/${idBusca}`);
      setTipos(res.data ? [res.data] : []);
    } catch (e) {
      setTipos([]);
    }
  };

  const salvar = async () => {
    try {
      const payload = {
        tipo: novoTipo.tipo,
        preco: Number(novoTipo.preco),
        taxa: Number(novoTipo.taxa),
        pontos: Number(novoTipo.pontos)
      };

      if (editando) {
        await api.put(`/tipos/${editando}`, payload);
      } else {
        await api.post('/tipos', payload);
      }

      setEditando(null);
      setNovoTipo({ tipo: "", preco: "", taxa: "", pontos: "" });
      carregarDados();
    } catch (e) {
      alert("Erro ao salvar");
    }
  };

  const prepararEdicao = (t) => {
    setNovoTipo({ tipo: t.tipo, preco: t.preco, taxa: t.taxa, pontos: t.pontos });
    setEditando(t.idtipo);
  };

  const tiposFiltrados = tipos.filter(t => 
    t.tipo.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">Admin</div>
        <nav><a href="/admin/dashboard">Voltar</a></nav>
      </div>
      <div className="conteudo">
        <h1>Gerenciar Tipos de Multa</h1>
        <div className="card">
          <h3>{editando ? "Editar Tipo" : "Novo Tipo de Infração"}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input className="input" placeholder="Nome do Tipo" value={novoTipo.tipo} onChange={e => setNovoTipo({...novoTipo, tipo: e.target.value})} />
            <input type="number" className="input" placeholder="Preço Base" value={novoTipo.preco} onChange={e => setNovoTipo({...novoTipo, preco: e.target.value})} />
            <input type="number" step="0.01" className="input" placeholder="Taxa Diária" value={novoTipo.taxa} onChange={e => setNovoTipo({...novoTipo, taxa: e.target.value})} />
            <input type="number" className="input" placeholder="Pontos" value={novoTipo.pontos} onChange={e => setNovoTipo({...novoTipo, pontos: e.target.value})} />
            <button className="botao" onClick={salvar}>{editando ? "Atualizar" : "Salvar"}</button>
            {editando && <button className="botao" style={{ background: '#64748b' }} onClick={() => { setEditando(null); setNovoTipo({ tipo: "", preco: "", taxa: "", pontos: "" }); }}>Cancelar</button>}
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input 
            className="input" 
            style={{ flex: 3 }}
            placeholder="🔍 Buscar por tipo..." 
            value={termoBusca} 
            onChange={e => setTermoBusca(e.target.value)} 
          />
          <input 
            className="input" 
            style={{ flex: 1 }}
            type="number"
            placeholder="🆔 ID Específico..." 
            value={idBusca}
            onChange={e => setIdBusca(e.target.value)}
            onKeyUp={e => e.key === 'Enter' && buscarPorId()}
          />
        </div>

        <table className="tabela">
          <thead><tr><th>Tipo</th><th>Preço Base</th><th>Taxa</th><th>Pontos</th><th>Ações</th></tr></thead>
          <tbody>
            {tiposFiltrados.map(t => (
              <tr key={t.idtipo}>
                <td>{t.tipo}</td><td>R$ {t.preco}</td><td>{t.taxa}</td><td>{t.pontos}</td>
                <td>
                  <button className="botao" style={{ marginRight: '5px' }} onClick={() => prepararEdicao(t)}>Editar</button>
                  <button className="botao botao-danger" onClick={async () => { if(window.confirm("Excluir?")){ await api.delete(`/tipos/${t.idtipo}`); carregarDados(); } }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
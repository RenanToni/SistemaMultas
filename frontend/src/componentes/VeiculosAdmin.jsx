import React, { useEffect, useState } from "react";
import api from "../api";

export default function VeiculosAdmin() {
  const [veiculos, setVeiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [novoVeiculo, setNovoVeiculo] = useState({ placa: "", marca: "", modelo: "", ano: "", idusuario: "" });
  const [editando, setEditando] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [idBusca, setIdBusca] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const respV = await api.get("/veiculos");
    const respU = await api.get("/pessoas");
    setVeiculos(respV.data);
    setUsuarios(respU.data);
  };

  const buscarPorId = async () => {
    if (!idBusca) {
      carregarDados();
      return;
    }
    try {
      const res = await api.get(`/veiculos/${idBusca}`);
      setVeiculos(res.data ? [res.data] : []);
    } catch (e) {
      setVeiculos([]);
    }
  };

  const cadastrar = async () => {
    try {
      if (editando) {
        await api.put(`/veiculos/${editando}`, novoVeiculo);
      } else {
        await api.post("/veiculos", novoVeiculo);
      }
      setNovoVeiculo({ placa: "", marca: "", modelo: "", ano: "", idusuario: "" });
      setEditando(null);
      carregarDados();
    } catch (e) { alert("Erro ao processar"); }
  };

  const prepararEdicao = (v) => {
    setNovoVeiculo({ placa: v.placa, marca: v.marca, modelo: v.modelo, ano: v.ano, idusuario: v.idusuario });
    setEditando(v.idveiculo);
  };

  const excluir = async (id) => {
    if (window.confirm("Deseja excluir?")) {
      await api.delete(`/veiculos/${id}`);
      carregarDados();
    }
  };

  const veiculosProcessados = React.useMemo(() => {
    let lista = [...veiculos];
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      lista = lista.filter(v => 
        v.placa.toLowerCase().includes(termo) ||
        v.modelo.toLowerCase().includes(termo) ||
        v.marca.toLowerCase().includes(termo) ||
        v.ano.toString().includes(termo)
      );
    }
    return lista;
  }, [veiculos, termoBusca]);

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">Admin</div>
        <nav><a href="/admin/dashboard">Voltar</a></nav>
      </div>
      <div className="conteudo">
        <h1>Gerenciar Veículos</h1>
        <div className="card">
          <h3>{editando ? "Editar Veículo" : "Novo Veículo"}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input className="input" placeholder="Placa" value={novoVeiculo.placa} onChange={e => setNovoVeiculo({...novoVeiculo, placa: e.target.value})} />
            <input className="input" placeholder="Marca" value={novoVeiculo.marca} onChange={e => setNovoVeiculo({...novoVeiculo, marca: e.target.value})} />
            <input className="input" placeholder="Modelo" value={novoVeiculo.modelo} onChange={e => setNovoVeiculo({...novoVeiculo, modelo: e.target.value})} />
            <input className="input" type="number" placeholder="Ano" value={novoVeiculo.ano} onChange={e => setNovoVeiculo({...novoVeiculo, ano: e.target.value})} />
            <select className="select" value={novoVeiculo.idusuario} onChange={e => setNovoVeiculo({...novoVeiculo, idusuario: e.target.value})}>
              <option value="">Selecione o Proprietário</option>
              {usuarios.map(u => <option key={u.idusuario} value={u.idusuario}>{u.nome} (CPF: {u.cpf})</option>)}
            </select>
            <button className="botao" onClick={cadastrar}>{editando ? "Atualizar" : "Salvar"}</button>
            {editando && (
              <button className="botao" style={{ background: '#64748b' }} 
                onClick={() => { setEditando(null); setNovoVeiculo({ placa: "", marca: "", modelo: "", ano: "", idusuario: "" }); }}>Cancelar</button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input 
            className="input"
            style={{ flex: 3 }}
            placeholder="🔍 Buscar por placa, modelo, marca ou ano..." 
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
              <th>Placa</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th>Proprietário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculosProcessados.map(v => (
              <tr key={v.idveiculo}>
                <td>{v.idveiculo}</td>
                <td>{v.placa}</td>
                <td>{v.marca} {v.modelo}</td>
                <td>{v.ano}</td>
                {/* Busca o nome do proprietário na lista de usuários carregada pelo frontend */}
                <td>
                  {usuarios.find(u => String(u.idusuario) === String(v.idusuario))?.nome || v.idusuario}
                </td>
                <td>
                  <button className="botao" style={{ marginRight: '5px' }} onClick={() => prepararEdicao(v)}>Editar</button>
                  <button className="botao botao-danger" onClick={() => excluir(v.idveiculo)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MultasAdmin() {
  const [multas, setMultas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [novaMulta, setNovaMulta] = useState({ idusuario: "", idveiculo: "", idtipo: "", datainfracao: "", datavencimento: "", status: 0 });
  const [editando, setEditando] = useState(null);
  const [idTipoOriginal, setIdTipoOriginal] = useState(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });
  const [idBusca, setIdBusca] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const [m, u, t, v] = await Promise.all([
        api.get('/multas'), 
        api.get('/pessoas'), 
        api.get('/tipos'),
        api.get('/veiculos')
    ]);
    setMultas(m.data);
    setUsuarios(u.data);
    setTipos(t.data);
    setVeiculos(v.data);
  };

  const buscarPorId = async () => {
    if (!idBusca) {
      carregarDados();
      return;
    }
    try {
      const res = await api.get(`/multas/${idBusca}`);
      setMultas(res.data ? [res.data] : []);
    } catch (e) {
      setMultas([]);
    }
  };

  const salvar = async () => {
    try {
      // Garante que os IDs sejam enviados como números para o banco de dados
      const payload = {
        ...novaMulta,
        idusuario: novaMulta.idusuario ? Number(novaMulta.idusuario) : null,
        idveiculo: novaMulta.idveiculo ? Number(novaMulta.idveiculo) : null,
        idtipo: novaMulta.idtipo ? Number(novaMulta.idtipo) : null,
        status: Number(novaMulta.status),
        datainfracao: novaMulta.datainfracao,
        datavencimento: novaMulta.datavencimento
      };

      console.log("FRONTEND - Enviando para API:", payload);

      // Verificação extra para garantir que o idveiculo não seja enviado como string vazia
      if (!novaMulta.idveiculo) {
        alert("Por favor, selecione um veículo para esta multa.");
        return;
      }

      if (editando) {
        // Lógica de ajuste de pontos na atualização
        const oldTipo = tipos.find(t => String(t.idtipo) === String(idTipoOriginal));
        const newTipo = tipos.find(t => String(t.idtipo) === String(payload.idtipo));
        const person = usuarios.find(u => String(u.idusuario) === String(payload.idusuario));

        if (oldTipo && newTipo && person && String(idTipoOriginal) !== String(payload.idtipo)) {
          const diff = newTipo.pontos - oldTipo.pontos;
          const novosPontos = person.pontos - diff;
          // Atualiza os pontos da pessoa no banco
          await api.put(`/pessoas/${person.idusuario}`, { ...person, pontos: novosPontos });
        }

        await api.put(`/multas/${editando}`, payload);
      } else {
        // Ao criar nova multa, também descontamos os pontos automaticamente
        const tipo = tipos.find(t => String(t.idtipo) === String(payload.idtipo));
        const person = usuarios.find(u => String(u.idusuario) === String(payload.idusuario));
        
        if (tipo && person) {
          await api.put(`/pessoas/${person.idusuario}`, { ...person, pontos: person.pontos - tipo.pontos });
        }
        
        await api.post('/multas', payload);
      }

      setEditando(null);
      setIdTipoOriginal(null);
      setNovaMulta({ idusuario: "", idveiculo: "", idtipo: "", datainfracao: "", datavencimento: "", status: 0 });
      carregarDados();
    } catch (e) { alert("Erro ao salvar"); }
  };

  const prepararEdicao = (m) => {
    setNovaMulta({ 
        idusuario: m.idusuario, 
        idveiculo: m.idveiculo || "",
        idtipo: m.idtipo, 
        datainfracao: m.datainfracao.split('T')[0], 
        datavencimento: m.datavencimento.split('T')[0], 
        status: m.status 
    });
    setEditando(m.idmultas);
    setIdTipoOriginal(m.idtipo);
  };

  // Normaliza para String para garantir que a comparação funcione (evita erro de tipo BigInt/String)
  const veiculosFiltrados = veiculos.filter(v => String(v.idusuario) === String(novaMulta.idusuario));

  // Lógica de Filtro e Ordenação
  const multasProcessadas = React.useMemo(() => {
    let lista = [...multas];

    // Filtro Global
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      lista = lista.filter(m => {
        const motorista = usuarios.find(u => String(u.idusuario) === String(m.idusuario))?.nome?.toLowerCase() || "";
        const vObj = veiculos.find(v => String(v.idveiculo) === String(m.idveiculo));
        const veiculo = vObj ? `${vObj.placa} ${vObj.modelo}`.toLowerCase() : "";
        const tipo = tipos.find(t => String(t.idtipo) === String(m.idtipo))?.tipo?.toLowerCase() || "";
        
        return motorista.includes(termo) || veiculo.includes(termo) || tipo.includes(termo);
      });
    }

    // Ordenação
    if (ordenacao.campo) {
      lista.sort((a, b) => {
        let valA = a[ordenacao.campo];
        let valB = b[ordenacao.campo];

        // Tratamento especial para datas
        if (ordenacao.campo.includes('data')) {
          valA = new Date(valA);
          valB = new Date(valB);
        }

        if (valA < valB) return ordenacao.direcao === 'asc' ? -1 : 1;
        if (valA > valB) return ordenacao.direcao === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return lista;
  }, [multas, termoBusca, ordenacao, usuarios, veiculos, tipos]);

  const solicitarOrdenacao = (campo) => {
    let direcao = 'asc';
    if (ordenacao.campo === campo && ordenacao.direcao === 'asc') direcao = 'desc';
    setOrdenacao({ campo, direcao });
  };

  // Função para exibir data sem o erro de "dia anterior" causado pelo fuso horário
  const formatarDataBR = (dataStr) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const renderStatus = (m) => {
    if (m.status === 1) return <span className="status-paga">Paga</span>;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera hora para comparação justa
    const vencimento = new Date(m.datavencimento);
    if (vencimento < hoje) return <span className="status-vencida">Vencida</span>;
    return <span className="status-pendente">Pendente</span>;
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">Admin</div>
        <nav><a href="/admin/dashboard">Voltar</a></nav>
      </div>
      <div className="conteudo">
        <h1>Gerenciar Multas</h1>
        <div className="card">
          <h3>{editando ? "Editar Multa" : "Lançar Nova Multa"}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select className="select" value={novaMulta.idusuario} onChange={e => setNovaMulta({...novaMulta, idusuario: e.target.value, idveiculo: ""})}>
              <option value="">Motorista</option>
              {usuarios.map(u => <option key={u.idusuario} value={u.idusuario}>{u.nome}</option>)}
            </select>
            <select className="select" value={novaMulta.idveiculo} onChange={e => setNovaMulta({...novaMulta, idveiculo: e.target.value})} disabled={!novaMulta.idusuario}>
              <option value="">Veículo</option>
              {veiculosFiltrados.map(v => <option key={v.idveiculo} value={v.idveiculo}>{v.placa} - {v.modelo}</option>)}
            </select>
            <select className="select" value={novaMulta.idtipo} onChange={e => setNovaMulta({...novaMulta, idtipo: e.target.value})}>
              <option value="">Tipo de Infração</option>
              {tipos.map(t => <option key={t.idtipo} value={t.idtipo}>{t.tipo} ({t.pontos} pts)</option>)}
            </select>
            <input type="date" className="input" value={novaMulta.datainfracao} onChange={e => setNovaMulta({...novaMulta, datainfracao: e.target.value})} />
            <input type="date" className="input" value={novaMulta.datavencimento} onChange={e => setNovaMulta({...novaMulta, datavencimento: e.target.value})} />
            <select className="select" value={novaMulta.status} onChange={e => setNovaMulta({...novaMulta, status: parseInt(e.target.value)})}>
                <option value={0}>Pendente</option>
                <option value={1}>Paga</option>
            </select>
            <button className="botao" onClick={salvar}>{editando ? "Atualizar" : "Salvar"}</button>
            {editando && (
              <button className="botao" style={{ background: '#64748b' }} 
                onClick={() => { setEditando(null); setNovaMulta({ idusuario: "", idveiculo: "", idtipo: "", datainfracao: "", datavencimento: "", status: 0 }); }}>Cancelar</button>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <input 
            className="input"
            style={{ flex: 3 }}
            placeholder="🔍 Buscar por motorista, placa ou infração..." 
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
          <thead>
            <tr>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Infração</th>
              <th>Preço</th>
              <th onClick={() => solicitarOrdenacao('datainfracao')} style={{ cursor: 'pointer' }}>Data ↕️</th>
              <th onClick={() => solicitarOrdenacao('datavencimento')} style={{ cursor: 'pointer' }}>Vencimento ↕️</th>
              <th onClick={() => solicitarOrdenacao('status')} style={{ cursor: 'pointer' }}>Status ↕️</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {multasProcessadas.map(m => (
              <tr key={m.idmultas}>
                {/* Resolve o nome do motorista e a placa do veículo localmente usando as listas carregadas */}
                <td>
                  {usuarios.find(u => String(u.idusuario) === String(m.idusuario))?.nome || m.idusuario}
                </td>
                <td>
                  {(() => {
                    // Tenta achar na lista local pelo ID ou usa o objeto vindo do backend
                    const vLocal = veiculos.find(v => String(v.idveiculo) === String(m.idveiculo));
                    return vLocal ? `${vLocal.placa} - ${vLocal.modelo}` : (m.veiculo?.placa || "N/A");
                  })()}
                </td>
                <td>{m.tipo?.tipo}</td>
                <td>
                  R$ {tipos.find(t => String(t.idtipo) === String(m.idtipo))?.preco || "0,00"}
                </td>
                <td>{formatarDataBR(m.datainfracao)}</td>
                <td>{formatarDataBR(m.datavencimento)}</td>
                <td>{renderStatus(m)}</td>
                <td>
                  <button className="botao" style={{ marginRight: '5px' }} onClick={() => prepararEdicao(m)}>Editar</button>
                  <button className="botao botao-danger" onClick={async () => { if(window.confirm("Excluir?")){ await api.delete(`/multas/${m.idmultas}`); carregarDados(); } }}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
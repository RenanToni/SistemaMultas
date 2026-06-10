import React, { useEffect, useState } from 'react';
import api from '../api';
import '../App.css';

export default function UserDashboard() {
  const [multas, setMultas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [termoBusca, setTermoBusca] = useState("");
  const [dataOcorrido, setDataOcorrido] = useState("");
  const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const respM = await api.get('/multas');
      const respV = await api.get(`/veiculos/usuario/${usuario.idusuario}`);
      setMultas(respM.data.filter(m => m.idusuario === usuario.idusuario));
      setVeiculos(respV.data);
    } catch (e) { console.error(e); }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const pagarMulta = async (id) => {
    try {
      // Primeiro chama a validação de vencimento para obter o valor real (com juros se houver)
      const respValida = await api.get(`/multas/validar_vencimento/${id}`);
      const { valor, status, diasAtraso } = respValida.data;

      let mensagem = `Deseja pagar esta multa no valor de R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}?`;
      
      if (status === "vencida") {
        mensagem = `Esta multa está VENCIDA (${diasAtraso} dias de atraso).\nO valor total com juros é R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.\n\nDeseja confirmar o pagamento?`;
      }

      if (window.confirm(mensagem)) {
        await api.put(`/multas/multa_paga/${id}`);
        alert("Multa paga com sucesso!");
        carregarDados();
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao processar o pagamento.");
    }
  };

  const multasProcessadas = React.useMemo(() => {
    let lista = [...multas];

    // Filtro Global (Placa, Modelo ou Tipo)
    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      lista = lista.filter(m => {
        const placa = m.veiculo?.placa?.toLowerCase() || "";
        const modelo = m.veiculo?.modelo?.toLowerCase() || "";
        const tipo = m.tipo?.tipo?.toLowerCase() || "";
        return placa.includes(termo) || modelo.includes(termo) || tipo.includes(termo);
      });
    }

    // Filtro por Data do Ocorrido
    if (dataOcorrido) {
      lista = lista.filter(m => {
        // Pega apenas a parte YYYY-MM-DD da string retornada pelo banco
        const dataLiteral = m.datainfracao.split('T')[0];
        return dataLiteral === dataOcorrido;
      });
    }

    // Ordenação
    if (ordenacao.campo) {
      lista.sort((a, b) => {
        let valA = a[ordenacao.campo];
        let valB = b[ordenacao.campo];

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
  }, [multas, termoBusca, dataOcorrido, ordenacao]);

  const solicitarOrdenacao = (campo) => {
    let direcao = 'asc';
    if (ordenacao.campo === campo && ordenacao.direcao === 'asc') direcao = 'desc';
    setOrdenacao({ campo, direcao });
  };

  // Formatação de data ignorando fuso horário
  const formatarDataBR = (dataStr) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const renderStatus = (m) => {
    if (m.status === 1) return <span className="status-paga">Paga</span>;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    const vencimento = new Date(m.datavencimento);
    if (vencimento < hoje) return <span className="status-vencida">Vencida</span>;
    return <span className="status-pendente">Pendente</span>;
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="logo">Portal</div>
        <p style={{ padding: '0 12px 20px', fontSize: '14px', color: '#94a3b8' }}>Olá, {usuario.nome}</p>
        <nav>
          <a href="/painel">Meu Painel</a>
          <button className="botao-danger" onClick={handleLogout} style={{marginTop: '20px'}}>Sair</button>
        </nav>
      </div>
      <div className="conteudo">
        <h1 className="titulo">Minhas Informações</h1>
        
        <div className="grid">
          <div className="card-dashboard"><h2>{usuario.pontos}</h2><p>Pontos na CNH</p></div>
          <div className="card-dashboard"><h2>{multas.length}</h2><p>Multas Vinculadas</p></div>
        </div>

        <h2 className="titulo" style={{ marginTop: '30px' }}>Meus Veículos</h2>
        <table className="tabela">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Marca/Modelo</th>
              <th>Ano</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map(v => (
              <tr key={v.idveiculo}>
                <td>{v.placa}</td>
                <td>{v.marca} {v.modelo}</td>
                <td>{v.ano}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="titulo" style={{ marginTop: '30px' }}>Minhas Multas</h2>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            className="input" 
            placeholder="🔍 Buscar por placa, modelo ou infração..." 
            value={termoBusca}
            onChange={e => setTermoBusca(e.target.value)}
            style={{ flex: 2 }}
          />
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ whiteSpace: 'nowrap', color: '#64748b' }}>Ocorrido em:</label>
            <input 
              type="date" 
              className="input" 
              value={dataOcorrido}
              onChange={e => setDataOcorrido(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
        </div>

        <table className="tabela">
          <thead>
            <tr>
              <th onClick={() => solicitarOrdenacao('datainfracao')} style={{ cursor: 'pointer' }}>Data ↕️</th>
              <th>Veículo</th>
              <th>Infração</th>
              <th>Preço Base</th>
              <th onClick={() => solicitarOrdenacao('datavencimento')} style={{ cursor: 'pointer' }}>Vencimento ↕️</th>
              <th onClick={() => solicitarOrdenacao('status')} style={{ cursor: 'pointer' }}>Status ↕️</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {multasProcessadas.map(m => (
              <tr key={m.idmultas}>
                <td>{formatarDataBR(m.datainfracao)}</td>
                <td>{m.veiculo ? `${m.veiculo.placa} - ${m.veiculo.modelo}` : "N/A"}</td>
                <td>{m.tipo?.tipo}</td>
                <td>R$ {m.tipo?.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || "0,00"}</td>
                <td>{formatarDataBR(m.datavencimento)}</td>
                <td>
                  {renderStatus(m)}
                </td>
                <td>
                  {m.status !== 1 && (
                    <button className="botao" onClick={() => pagarMulta(m.idmultas)}>Pagar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
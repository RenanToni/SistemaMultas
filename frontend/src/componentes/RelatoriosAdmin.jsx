import { useEffect, useState } from "react";
import axios from "axios";

export default function RelatoriosAdmin() {
  console.log("Renderizando RelatoriosAdmin");
  console.log("-------------------------------------------------------------------------------------")
  const [dados, setDados] = useState({
    totalArrecadado: 0,
    multasMes: 0
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {

    try {

      const resposta = await axios.get(
        "http://localhost:3001/relatorios"
      );

      setDados(resposta.data);

    } catch (erro) {

      console.error(erro);

    }
  }

  return (

    <div>

      <h1>Relatórios</h1>

      <div>

        <h3>Total Arrecadado</h3>
        <p>R$ {dados.totalArrecadado}</p>

      </div>

      <div>

        <h3>Multas do Mês</h3>
        <p>{dados.multasMes}</p>

      </div>

    </div>

  );
}
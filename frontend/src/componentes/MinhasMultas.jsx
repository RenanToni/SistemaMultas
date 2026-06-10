import { useEffect, useState } from "react";
import axios from "axios";

export default function MinhasMultas() {

  const [multas,setMultas] = useState([]);

  useEffect(()=>{

    listar();

  },[]);

  async function listar(){

    const usuario =
      JSON.parse(
        localStorage.getItem("usuario")
      );

    const resposta =
      await axios.get(
        "http://localhost:3001/multas"
      );

    setMultas(
      resposta.data.filter(
        multa =>
          multa.idusuario === usuario.idusuario
      )
    );

  }

  return (

    <table>

      <thead>
        <tr>
          <th>Tipo</th>
          <th>Status</th>
          <th>Infração</th>
          <th>Vencimento</th>
        </tr>
      </thead>

      <tbody>

      {multas.map((m)=>(
        <tr key={m.idmultas}>
          <td>{m.tipo?.tipo}</td>
          <td>{m.status}</td>
          <td>{m.datainfracao}</td>
          <td>{m.datavencimento}</td>
        </tr>
      ))}

      </tbody>

    </table>

  );

}
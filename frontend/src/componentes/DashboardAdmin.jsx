import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard(){
  console.log ("Renderizando DashboardAdmin");
  console.log ("-------------------------------------------------------------------------------------")
  const [dados,setDados] =
    useState({});

  useEffect(()=>{

    carregar();

  },[]);

  async function carregar(){

    const resposta =
      await axios.get(
        "http://localhost:3001/dashboard"
      );

    setDados(
      resposta.data
    );

  }

  return (

    <>
      <h2>Usuários: {dados.usuarios}</h2>
      <h2>Veículos: {dados.veiculos}</h2>
      <h2>Tipos: {dados.tipos}</h2>
      <h2>Multas: {dados.multas}</h2>
    </>

  );

}
import { useEffect, useState } from "react";
import axios from "axios";

export default function Veiculos() {

  const [veiculos,setVeiculos] = useState([]);

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
        `http://localhost:3001/veiculos/usuario/${usuario.idusuario}`
      );

    setVeiculos(resposta.data);

  }

  return (

    <>
      {veiculos.map((v)=>(
        <div key={v.idveiculo}>
          {v.placa} - {v.modelo}
        </div>
      ))}
    </>

  );

}
import { useEffect, useState } from "react";
import api from "../api";

export default function MeuPainel() {

  const [usuario,setUsuario] = useState({});
  const [multas,setMultas] = useState([]);
  const [veiculos,setVeiculos] = useState([]);

  useEffect(()=>{

    carregar();

  },[]);

  async function carregar(){

    const dadosUsuario =
      JSON.parse(
        localStorage.getItem("usuario")
      );

    const id = dadosUsuario.idusuario;
    console.log('MeuPainel: Iniciando carga de dados para o ID de usuário:', id);

    const usuarioResp = await api.get(`/pessoas/${id}`);
    console.log('MeuPainel: Perfil do usuário carregado do banco:', usuarioResp.data);

    const multasResp = await api.get(`/multas`);

    const veiculosResp =
      await api.get(`/veiculos/usuario/${id}`);

    setUsuario(usuarioResp.data);

    setMultas(
      multasResp.data.filter(
        x => x.idusuario === id
      )
    );

    setVeiculos(veiculosResp.data);

  }

  return (
    <>
      <h1>{usuario.nome}</h1>

      <p>Pontos: {usuario.pontos}</p>

      <p>Multas: {multas.length}</p>

      <p>Veículos: {veiculos.length}</p>
    </>
  );
}
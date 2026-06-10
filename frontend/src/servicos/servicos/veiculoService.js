import api from './api';

export async function listarVeiculos(idusuario){

  const resposta =
    await api.get(
      `/veiculos/usuario/${idusuario}`
    );

  return resposta.data;
}

export async function cadastrarVeiculo(dados){

  return api.post(
    '/veiculos',
    dados
  );
}
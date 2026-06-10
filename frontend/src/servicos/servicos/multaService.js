import api from './api';

export async function listarMultas(){

  const resposta =
    await api.get('/multas');

  return resposta.data;
}
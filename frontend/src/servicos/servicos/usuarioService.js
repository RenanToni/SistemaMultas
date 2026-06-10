import api from './api';

export async function listarUsuarios(){

  const resposta =
    await api.get('/usuarios');

  return resposta.data;
}
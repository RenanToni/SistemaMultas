import Pessoa from "../models/Pessoa_models.js";

async function create(req, res) {
    try {
        const { nome, cpf, pontos } = req.body;
        console.log(nome, cpf, pontos);
        const newUsuario = await Pessoa.create({ nome, cpf, pontos });
        res.status(201).json(newUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function getAll(req, res) {
    try {
        const usuarios = await Pessoa.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params;
        const usuario = await Pessoa.findByPk(id);
        if (usuario) {
            res.status(200).json(usuario);
        }
        else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, cpf, pontos } = req.body;
        const usuarioToUpdate = await Pessoa.findByPk(id);
        if (usuarioToUpdate) {
            usuarioToUpdate.nome = nome;
            usuarioToUpdate.cpf = cpf;
            usuarioToUpdate.pontos = pontos;
            await usuarioToUpdate.save();
            res.status(200).json(usuarioToUpdate);
        }
        else {
        console.error(error);
        res.status(500).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
    }
}

export default { create, getAll, getById, update };
import Pessoa from "../models/Pessoa_models.js";

async function create(req, res) {
    try {
        let { nome, cpf, pontos, perfil, senha } = req.body;
        
        // Normaliza o CPF para salvar apenas números
        const cpfLimpo = cpf.toString().replace(/\D/g, '');

        const newUsuario = await Pessoa.create({ 
            nome, 
            cpf: cpfLimpo, 
            pontos, 
            perfil, 
            senha: senha 
        });
        
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
        const { nome, cpf, pontos, perfil, senha } = req.body;
        const usuarioToUpdate = await Pessoa.findByPk(id);

        if (usuarioToUpdate) {
            usuarioToUpdate.nome = nome;
            // Normaliza o CPF no update também
            usuarioToUpdate.cpf = cpf ? cpf.toString().replace(/\D/g, '') : usuarioToUpdate.cpf;
            usuarioToUpdate.pontos = pontos;
            usuarioToUpdate.perfil = perfil;

            // Criptografa a senha apenas se ela for enviada no corpo da requisição
            if (senha) {
                usuarioToUpdate.senha = senha;
            }

            await usuarioToUpdate.save();
            res.status(200).json(usuarioToUpdate);
        }
        else {
            res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;
        const usuarioToDelete = await Pessoa.findByPk(id);
        if (usuarioToDelete) {
            await usuarioToDelete.destroy();
            res.status(200).json({ message: 'Usuário excluído com sucesso.' });
        }
        else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export default { create, getAll, getById, update, remove };
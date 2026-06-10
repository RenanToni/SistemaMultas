import Tipo from "../models/Tipo_models.js";


async function  create(req, res) {
    try {
        const { tipo, preco, taxa, pontos } = req.body;

        if (!tipo || preco === undefined || taxa === undefined || pontos === undefined) {
            return res.status(400).json({
                error: "Todos os campos (tipo, preco, taxa, pontos) são obrigatórios."
            });
        }

        const newTipo = await Tipo.create({ tipo, preco, taxa, pontos });
        res.status(201).json(newTipo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function  getAll(req, res) {
    try {
        const tipos = await Tipo.findAll();
        res.status(200).json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
async function  getById(req, res) {
    try {
        const { id } = req.params;
        const tipo = await Tipo.findByPk(id);
        if (tipo) {
            res.status(200).json(tipo);
        }
        else {
            res.status(404).json({ error: 'Tipo de multa não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
async function  update(req, res) {
    try {
        const { id } = req.params;
        const { tipo, preco, taxa, pontos } = req.body;
        const tipoToUpdate = await Tipo.findByPk(id);

        if (tipoToUpdate) {
            tipoToUpdate.tipo = tipo || tipoToUpdate.tipo;
            tipoToUpdate.preco = preco !== undefined ? preco : tipoToUpdate.preco;
            tipoToUpdate.taxa = taxa !== undefined ? taxa : tipoToUpdate.taxa;
            tipoToUpdate.pontos = pontos !== undefined ? pontos : tipoToUpdate.pontos;
            await tipoToUpdate.save();
            res.status(200).json(tipoToUpdate);
        }
        else {
            res.status(404).json({ error: 'Tipo de multa não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}
    
async function  remove(req, res) {
    try {
        const { id } = req.params;
        const tipoToDelete = await Tipo.findByPk(id);
        if (tipoToDelete) {
            await tipoToDelete.destroy();
            res.status(200).json({ message: 'Tipo de multa excluído com sucesso.' });
        }
        else {
            res.status(404).json({ error: 'Tipo de multa não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


export default { update, getById, getAll, create, remove };

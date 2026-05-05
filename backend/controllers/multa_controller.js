import Multa from "../models/Multa_model.js";
import Tipo from "../models/Tipo_models.js";
import Pessoa from "../models/Pessoa_models.js";

// ==================== CREATE ====================
async function create(req, res) {
    try {
        const { idusuario, datainfracao, datavencimento, status, idtipo } = req.body;

        const pessoa = await Pessoa.findByPk(idusuario);
        if (!pessoa) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // validar tipo
        const tipo = await Tipo.findByPk(idtipo);
        if (!tipo) {
            return res.status(404).json({ error: "Tipo de multa não encontrado" });
        }

        // descontar pontos
        const novosPontos = Math.max(0, pessoa.pontos - tipo.pontos);

        await Pessoa.update(
            { pontos: novosPontos },
            { where: { idusuario } }
        );

        console.log(datavencimento, datainfracao);
        const novaMulta = await Multa.create({
            idusuario,
            datainfracao,
            datavencimento,
            status, 

            idtipo
        });

        return res.status(201).json({
            mensagem: "Multa criada com sucesso",
            multa: novaMulta,
            pontosAntes: pessoa.pontos,
            pontosDepois: novosPontos
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ==================== GET ALL ====================
async function getAll(req, res) {
    try {
        const multas = await Multa.findAll({
            include: [Tipo, Pessoa]
        });

        return res.status(200).json(multas);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ==================== GET BY ID ====================
async function getById(req, res) {
    try {
        const { id } = req.params;

        const multa = await Multa.findByPk(id, {
            include: [Tipo, Pessoa]
        });

        if (!multa) {
            return res.status(404).json({ error: "Multa não encontrada" });
        }

        return res.status(200).json(multa);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ==================== UPDATE ====================
async function update(req, res) {
    try {
        const { id } = req.params;
        const { idusuario, datainfracao, datavencimento, status, idtipo } = req.body;

        const multa = await Multa.findByPk(id);

        if (!multa) {
            return res.status(404).json({ error: "Multa não encontrada" });
        }

        multa.idusuario = idusuario;
        multa.datainfracao = datainfracao;
        multa.datavencimento = datavencimento;
        multa.status = status;
        multa.idtipo = idtipo;

        await multa.save();

        return res.status(200).json(multa);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ==================== VALIDAR VENCIMENTO ====================
async function validar_vencimento(req, res) {
    try {
        const { id } = req.params;

        const multa = await Multa.findByPk(id);
        if (!multa) {
            return res.status(404).json({ error: "Multa não encontrada" });
        }

        const tipo = await Tipo.findByPk(multa.idtipo);
        if (!tipo) {
            return res.status(404).json({ error: "Tipo não encontrado" });
        }

        const dataAtual = new Date();
        const datavencimento = new Date(multa.datavencimento);
        console.log("Data Atual:", dataAtual);
        console.log("Data Vencimento:", datavencimento);
        const preco = Number(tipo.preco);
        const taxa = Number(tipo.taxa);

        // multa vencida
        if (dataAtual > datavencimento) {

            const diferenca = dataAtual - datavencimento;
            const diasAtraso = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

            const valorMulta = preco + (preco * taxa * diasAtraso);

            return res.status(200).json({
                status: "vencida",
                diasAtraso,
                valor: valorMulta
            });

        } else {
            return res.status(200).json({
                status: "em dia",
                valor: preco
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ==================== PAGAR MULTA ====================
async function multa_paga(req, res) {
    try {
        const { id } = req.params;

        const multa = await Multa.findByPk(id);

        if (!multa) {
            return res.status(404).json({ error: "Multa não encontrada" });
        }

        multa.status = 1;

        await multa.save();

        return res.status(200).json({ message: "Multa paga com sucesso" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

// ==================== EXPORT ====================
export default {create,getAll,getById,update,validar_vencimento,multa_paga};
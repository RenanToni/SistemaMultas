import Veiculo from "../models/Veiculo_model.js";

async function getAll(req,res){
    const dados = await Veiculo.findAll();
    res.json(dados);
}

async function getByUsuario(req,res){

    const { idusuario } = req.params;

    const dados = await Veiculo.findAll({
        where:{ idusuario }
    });

    res.json(dados);
}

async function getById(req,res){

    const { id } = req.params;

    const dados = await Veiculo.findByPk(id);

    res.json(dados);
}


async function create(req,res){

    if (!req.body.placa || !req.body.modelo || !req.body.marca || !req.body.idusuario){
        return res.status(400).json({
            erro:"Campos obrigatórios: placa, modelo, marca e idusuario"
        });
    }

    const novo = await Veiculo.create(req.body);

    res.status(201).json(novo);
}

async function update(req,res){

    const { id } = req.params;

    await Veiculo.update(
        req.body,
        {
            where:{
                idveiculo:id
            }
        }
    );

    res.json({
        mensagem:"Atualizado"
    });
}

async function remove(req,res){

    const { id } = req.params;

    await Veiculo.destroy({
        where:{
            idveiculo:id
        }
    });

    res.json({
        mensagem:"Excluído"
    });
}

export default { getAll, getByUsuario, getById, create, update, remove };
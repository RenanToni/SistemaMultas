import jwt from "jsonwebtoken";

import Pessoa from "../models/Pessoa_models.js";

async function login(req,res){
    try {
        let { cpf, senha } = req.body;

        // Remove qualquer caractere que não seja número (pontos, traços, espaços)
        const cpfLimpo = cpf.toString().replace(/\D/g, '');

        console.log("Tentativa de login: CPF original:", cpf, "| CPF limpo:", cpfLimpo);

        const usuario = await Pessoa.findOne({
            where: { cpf: cpfLimpo } 
        });

        console.log("Resultado da busca no banco:", usuario ? "Usuário encontrado" : "Usuário NÃO encontrado");

        if (!usuario) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        const senhaValida = senha === usuario.senha;

        if(!senhaValida){
            return res.status(401).json({
                erro:"CPF ou senha inválida"
            });
        }

        const token = jwt.sign(
            {
                id:usuario.idusuario,
                perfil:usuario.perfil
            },
            "segredo"
        );

        res.json({
            token,
            usuario
        });
    } catch (error) {
        console.error("ERRO CRÍTICO NO LOGIN:", error); // Log completo do objeto de erro
        res.status(500).json({ erro: "Erro interno no servidor", detalhes: error.message, stack: error.stack });
    }
}

export default { login };
import Pessoa from "../models/Pessoa_models.js";
import Veiculo from "../models/Veiculo_model.js";
import Tipo from "../models/Tipo_models.js";
import Multa from "../models/Multa_model.js";
import validarMulta from "./multa_controller.js";

async function dashboard(req,res){

    const pessoas =
        await Pessoa.count();

    const veiculos =
        await Veiculo.count();

    const tipos =
        await Tipo.count();

    const multas =
        await Multa.count();


    res.json({
        pessoas,
        veiculos,
        tipos,
        multas,
        vencida,
        paga,
        pendente
    });
}

export default { dashboard };
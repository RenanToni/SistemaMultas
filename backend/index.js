import express from 'express';
import banco from './banco.js';
import Multa from "./controllers/multa_controller.js";
import Tipo from './controllers/tipo_controller.js';
import Pessoa from './controllers/pessoa_controller.js';

const app = express();
app.use(express.json());

try {
    await banco.authenticate(), console.log('Conexão com o banco de dados estabelecida com sucesso.');
} catch (error) {
    console.error('Erro ao autenticar no banco de dados:', error);
};


app.post('/multas', (req, res) => Multa.create(req, res));
app.get('/multas', (req, res) => Multa.getAll(req, res));
app.get('/multas/:id', (req, res) => Multa.getById(req, res));
app.put('/multas/:id', (req, res) => Multa.update(req, res));
app.get('/multas/validar_vencimento/:id', (req, res) => Multa.validar_vencimento(req, res));
app.put('/multas/multa_paga/:id', (req, res) => Multa.multa_paga(req, res));

app.post('/tipos', (req, res) => Tipo.create(req, res));
app.get('/tipos', (req, res) => Tipo.getAll(req, res));
app.get('/tipos/:id', (req, res) => Tipo.getById(req, res));
app.put('/tipos/:id', (req, res) => Tipo.update(req, res));
app.delete('/tipos/:id', (req, res) => Tipo.delete(req, res));

app.get('/pessoas', (req, res) => Pessoa.getAll(req, res));
app.post('/pessoas', (req, res) => Pessoa.create(req, res));
app.get('/pessoas/:id', (req, res) => Pessoa.getById(req, res));
app.put('/pessoas/:id', (req, res) => Pessoa.update(req, res));


app.listen(4000, () => { console.log('Api rodando na porta 4000...') });
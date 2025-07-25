const express = require('express');
const consulta = require('../controler/consulta');
const autenticar = require('../middleware/authToken');
const router = express.Router();





router.get('/', consulta.home);
router.get('/listarTudo', consulta.listarTudo);
router.post('/criar/user', consulta.criarUser);
router.post('/user/auth', consulta.authUser);
router.get('/logado', autenticar, consulta.logado)
router.post('/criar/moto', consulta.criarMoto);
router.post('/criar/aluguel', consulta.criarAluguel);
router.post('/criar/pagamento', consulta.criarPagamento);
router.get('/listarUltimo', consulta.listarUltimo);
router.get('/listar/motos', consulta.listarMotos);
router.get('/listar/dados/:id', consulta.listarDadosUser);
router.get('/listar/alugueis/ativos/:UserId', consulta.filterAluguelUser);
router.put('/user/atualizar', consulta.atualizarUser);
router.put('/aluguel/atualizar', consulta.atualizarAluguel);
router.post('/delete/user/:id', consulta.deleteUser);
router.put('/user/remover/moto/:id', consulta.removerMotoUser);
router.post('/delete/moto/:id', consulta.deleteMoto);
router.get('/total/pagamentos', consulta.totalPagamentos);
router.get('/total/aluguel', consulta.totalAluguel);




module.exports = router;
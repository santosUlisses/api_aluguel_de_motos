const express = require('express');
const consulta = require('../../controllers/consulta');
const UserController = require('../modules/user/UserController');
const MotoController = require('../modules/moto/MotoController');
const AluguelController = require('../modules/aluguel/AluguelController');
const PagamentoController = require('../modules/pagamento/PagamentoController');
const Token = require('../../middleware/Token');
const router = express.Router();






router.get('/', consulta.home);
// router.post('/testando', consulta.teste);
router.get('/logado', Token.autenticar, consulta.logado)



router.get('/usuarios', UserController.usuarios);
router.post('/usuario', UserController.criarUsuario);
router.post('/usuario/login', UserController.autenticarLogin);
router.put('/usuario/:id', UserController.editarUsuario);
router.delete('/usuario/:id', UserController.deleteUser);
router.get('/usuario/:id', UserController.buscarDadosId);
router.put('/usuario/remover/moto/:id', UserController.removerMotoUser);



router.get('/motos', MotoController.listarMotos);
router.post('/moto', MotoController.criarMoto);
router.delete('/moto/:id', MotoController.deletarMoto);



router.post('/aluguel', AluguelController.criarAluguel);
router.get('/aluguel/total', consulta.totalAluguel);
router.get('/alugueis', AluguelController.alugueis);
router.get('/aluguel/:id', AluguelController.buscarAluguel);
router.put('/aluguel/:id', AluguelController.editarAluguel);



router.get('/pagamento', PagamentoController.pagamentos);
router.get('/pagamento/usuario/:id', PagamentoController.pagamentoUsuario);

router.post('/pagamento/criar', consulta.criarPagamento);
router.get('/pagamento/total', consulta.totalPagamentos);

router.get('/listarUltimo', consulta.listarUltimo);




module.exports = router;
const express = require('express');
const UserController = require('../modules/user/UserController');
const MotoController = require('../modules/moto/MotoController');
const AluguelController = require('../modules/aluguel/AluguelController');
const PagamentoController = require('../modules/pagamento/PagamentoController');
const RevisaoController = require('../modules/revisao/RevisaoController');
const ImagensController = require('../modules/imagem/ImagensController');
const ComentarioController = require('../modules/comentario/ComentarioController');
const Autenticar = require('../middleware/Autenticar');
const Autorizar = require('../middleware/Autorizar');
const upload = require('../shared/services/multer');
const router = express.Router();








router.post('/usuario', UserController.criarUsuario);
router.get('/usuarios', Autenticar.autenticar, Autorizar.admin, UserController.usuarios);
router.post('/usuario/login', UserController.autenticarLogin);

router.get('/usuario/:id', Autenticar.autenticar, Autorizar.usuario, UserController.buscarUsuario);
router.get('/usuario/:id/alugueis', Autenticar.autenticar, Autorizar.admin, UserController.buscarAlugueis);
router.put('/usuario/:id', Autenticar.autenticar, UserController.editarUsuario);
router.delete('/usuario/:id', UserController.deleteUser);

router.post('/moto', Autenticar.autenticar, Autorizar.admin, MotoController.criarMoto);
router.get('/motos', Autenticar.autenticar, Autorizar.admin, MotoController.listarMotos);
router.get('/moto/:id', Autenticar.autenticar, Autorizar.admin, MotoController.buscarMotoId);
router.put('/moto/:id', Autenticar.autenticar, Autorizar.admin, MotoController.editarMoto);
router.post('/moto/:id/imagem', Autenticar.autenticar, Autorizar.admin, upload.single("imagem"), ImagensController.criarImagem);
router.get("/moto/:id/imagem", Autenticar.autenticar, Autorizar.admin, ImagensController.buscarImagensMoto);
router.get("/imagem/destaque", Autenticar.autenticar, Autorizar.admin, ImagensController.buscarImagensDestaque)
router.put("/imagem/:id", Autenticar.autenticar, Autorizar.admin, ImagensController.editarDestaque);
router.delete("/imagem/:id", ImagensController.deletar_imagem);
router.delete('/moto/:id', Autenticar.autenticar, Autorizar.admin, MotoController.deletarMoto);



router.post('/aluguel', Autenticar.autenticar, Autorizar.admin, AluguelController.criarAluguel);
router.get('/alugueis', Autenticar.autenticar, Autorizar.admin, AluguelController.alugueis);
router.get('/alugueis/usuario/:id', Autenticar.autenticar, Autorizar.usuario, AluguelController.alugueisUsuario);
router.get('/aluguel/:id', Autenticar.autenticar, Autorizar.admin, AluguelController.buscarAluguelId);
router.put('/aluguel/:id', Autenticar.autenticar, Autorizar.admin, AluguelController.editarAluguel);
router.delete('/aluguel/:id', Autenticar.autenticar, Autorizar.admin, AluguelController.apagarAluguel);

router.post('/revisao', Autenticar.autenticar, Autorizar.admin, RevisaoController.criarRevisao);
router.get('/moto/:id/revisao', Autenticar.autenticar, Autorizar.admin, RevisaoController.buscarRevisaoMoto);
router.get('/revisao/:id', Autenticar.autenticar, Autorizar.admin, RevisaoController.buscarRevisao);
router.post('/revisao/:id', Autenticar.autenticar, Autorizar.admin, RevisaoController.editarRevisao);
router.delete('/revisao/:id', Autenticar.autenticar, Autorizar.admin, RevisaoController.deletarRevisao);

router.get('/pagamentos', Autenticar.autenticar, Autorizar.admin, PagamentoController.pagamentos);
router.get('/pagamento/usuario/:id', Autenticar.autenticar, Autorizar.usuario, PagamentoController.pagamentoUsuario);
router.get('/pagamento/:id', Autenticar.autenticar, Autorizar.admin, PagamentoController.buscarPagamento);
router.post('/pagamento', Autenticar.autenticar, Autorizar.admin, PagamentoController.criarPagamento);

router.post("/comentario", Autenticar.autenticar, Autorizar.admin, ComentarioController.criar);
router.get("/comentarios", Autenticar.autenticar, Autorizar.admin, ComentarioController.buscar);
router.get("/comentarios/aprovado", Autenticar.autenticar, Autorizar.admin, ComentarioController.buscarAprovado);
router.put("/comentario/:id/status", Autenticar.autenticar, Autorizar.admin, ComentarioController.mudarStatus);






module.exports = router;
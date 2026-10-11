const AppError = require('../../shared/errors/AppError');
const PagamentoService = require('./PagamentoService');

class PagamentoController {
    async pagamentos(req, res) {
        const { page } = req.query;
        try {
            const pagamentos = await PagamentoService.pagamentos(page);
            return res.status(200).json(pagamentos);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async pagamentoUsuario(req, res) {
        const id = Number(req.params.id);
        const page = Number(req.query.page) || 1;
        try {
            const pagamentoUsuario = await PagamentoService.pagamentoPorUsuario(id, page);
            return res.status(200).json(pagamentoUsuario);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async buscarPagamento(req, res) {
        const { id } = req.params;
        try {
            const pagamento = await PagamentoService.buscarPagamento(id);
            return res.status(200).json({ pagamento });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async criarPagamento(req, res) {
        const { id, valor_aluguel, UserId, novo_vencimento } = req.body;
        const valor_pago = valor_aluguel;
        try {
            await PagamentoService.criarPagamento({ id, valor_pago, UserId, novo_vencimento });
            res.status(200).json({ "message": "Pagamento realizado" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

}

module.exports = new PagamentoController();
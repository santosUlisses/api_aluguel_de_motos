const PagamentoService = require('./PagamentoService');

class PagamentoController {
    async pagamentos(req, res) {
        try {
            const pagamentos = await PagamentoService.pagamentos();
            return res.status(200).json({ pagamentos });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async pagamentoUsuario(req, res) {
        const { id } = req.params;
        try {
            const pagamentoUsuario = await PagamentoService.pagamentoPorUsuario(id);
            return res.status(200).json({ pagamentoUsuario });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
}

module.exports = new PagamentoController();
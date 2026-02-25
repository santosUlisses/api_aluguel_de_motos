const PagamentoRepository = require('./PagamentoRepository');

class PagamentoService {
    async pagamentos() {
        const pagamentos = (await PagamentoRepository.pagamentos()).map(pa => pa.get({ plain: true })).map(p => {
            return {
                id: p.id,
                data_pagamento: p.data_pagamento,
                valor_pago: p.valor_pago,
                AluguelId: p.AluguelId,
                UserId: p.UserId,
                usuario: p.User.nome
            }
        });
        return pagamentos;
    }
    async pagamentoPorUsuario(id) {
        const pagamentos = PagamentoRepository.pagamentoPorUsuario(id);
        return pagamentos;
    }
}

module.exports = new PagamentoService();
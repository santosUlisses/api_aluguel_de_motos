const Pagamento = require('../../models/Pagamento');
const User = require('../../models/User')

class PagamentoRepository {
    async pagamentos(limit, offset) {
        return await Pagamento.findAndCountAll({ limit, offset, include: { model: User, attributes: ['nome'] }, order: [["id", "DESC"]] });
    }
    async pagamentoPorAluguel(id) {
        return await Pagamento.findOne({ where: { AluguelId: id } });
    }
    async pagamentoPorUsuario({ id, limit, offset }) {
        return await Pagamento.findAndCountAll({ limit, offset, where: { UserId: id } });
    }
    async buscarPagamento(id) {
        return await Pagamento.findOne({ where: { id } });
    }
    async criarPagamento({ id, data_pagamento, valor_pago, UserId }, { transaction }) {
        return await Pagamento.create({ data_pagamento, valor_pago, UserId, AluguelId: id }, { transaction });
    }
    async somarPagamentos() {
        return await Pagamento.sum("valor_pago");
    }
}

module.exports = new PagamentoRepository();
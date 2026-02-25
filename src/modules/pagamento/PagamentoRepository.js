const Pagamento = require('../../../models/Pagamento');
const User = require('../../../models/User')

class PagamentoRepository {
    async pagamentos() {
        return await Pagamento.findAll({ include: { model: User, attributes: ['nome'] } });
    }
    async pagamentoPorAluguel(id) {
        return await Pagamento.findOne({ where: { AluguelId: id } });
    }
    async pagamentoPorUsuario(id) {
        return await Pagamento.findAll({ where: { UserId: id } });
    }
}

module.exports = new PagamentoRepository();
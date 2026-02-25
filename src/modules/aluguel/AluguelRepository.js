const Aluguel = require('../../../models/Aluguel');
const User = require('../../../models/User');
const Moto = require('../../../models/Moto');



class AluguelRepository {
    async verificarAluguelAtivo(userId, motoId) {
        return await Aluguel.findOne({ where: { status: "ativo", UserId: userId, MotoId: motoId } });
    }
    async criarAluguel(data_inicio, data_vencimento, valor_aluguel, UserId, MotoId, transaction) {
        return await Aluguel.create({ data_inicio, data_vencimento, valor_aluguel, status: "ativo", UserId, MotoId }, { transaction });
    }
    async alugueis() {
        return await Aluguel.findAll({ include: [{ model: User, attributes: ['nome'] }, { model: Moto, attributes: ['nome', 'placa'] }] });
    }
    async editarAluguel(id, data_vencimento, valor_aluguel, status) {
        return await Aluguel.update({ data_vencimento, valor_aluguel, status }, { where: { id } });
    }
    async buscarAluguel(id) {
        return await Aluguel.findOne({ include: [{ model: User, attributes: ['nome'] }, { model: Moto, attributes: ['nome', 'placa'] }], where: { id } });
    }
    async apagarAluguel(id) {
        return await Aluguel.destroy({ where: { id } });
    }
}

module.exports = new AluguelRepository();
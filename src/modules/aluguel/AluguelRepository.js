const Aluguel = require('../../models/Aluguel');
const User = require('../../models/User');
const Moto = require('../../models/Moto');



class AluguelRepository {
    async verificarAluguelAtivo(userId, motoId) {
        return await Aluguel.findOne({ where: { status: "ativo", UserId: userId, MotoId: motoId } });
    }
    async criarAluguel({ data_inicio, data_vencimento, valor_aluguel, UserId, MotoId }, { transaction }) {
        return await Aluguel.create({ data_inicio, data_vencimento, valor_aluguel, status: "ativo", UserId, MotoId }, { transaction });
    }
    async alugueis({ limit, offset }) {
        return await Aluguel.findAndCountAll({ limit, offset, include: [{ model: User, attributes: ['nome'] }, { model: Moto, attributes: ['nome', 'placa'] }] });
    }
    async alugueisUsuario(id, limit, offset) {
        return await Aluguel.findAndCountAll({
            limit, offset, where: { UserId: id },
            include: [{ model: Moto, attributes: ['nome', 'placa'] }], order: [['id', 'DESC']]
        },);
    }
    async editarAluguel({ id, data_vencimento, valor_aluguel, status }) {
        return await Aluguel.update({ data_vencimento, valor_aluguel, status }, { where: { id } });
    }
    async editarVencimento({ id, data_vencimento }, { transaction }) {
        return await Aluguel.update({ data_vencimento }, { where: { id }, transaction });
    }
    async buscarAluguelId(id) {
        return await Aluguel.findOne({ include: [{ model: User, attributes: ['nome'] }, { model: Moto, attributes: ['id', 'nome', 'placa'] }], where: { id } });
    }
    async apagarAluguel(id) {
        return await Aluguel.destroy({ where: { id } });
    }
    async buscarAluguelMoto(MotoId) {
        return await Aluguel.findOne({ where: { MotoId } });
    }
    async buscarPorStatus({ status, limit, offset }) {
        return await Aluguel.findAndCountAll({
            limit, offset, where: { status },
            include: [{ model: User, attributes: ['nome'] }, { model: Moto, attributes: ['nome', 'placa'] }]
        });
    }
}

module.exports = new AluguelRepository();
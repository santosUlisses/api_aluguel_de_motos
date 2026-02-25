const User = require('../../../models/User');
const Aluguel = require('../../../models/Aluguel');
const Moto = require('../../../models/Moto');

class UserRepository {
    async criar(dados) {
        return await User.create(dados);
    }
    async listar() {
        return await User.findAll();
    }
    async buscarEmail(email) {
        return await User.findOne({ where: { email: email } });
    }
    async buscarUsuarioId(id) {
        return await User.findOne({ where: { id } });
    }
    async editarDados({ id, nome, email, senha }) {
        return await User.update({ nome, email, senha }, { where: { id } });
    }
    async buscarDadosId(id) {
        return await User.findOne({
            where: { id }, include: [
                { model: Aluguel, include: { model: Moto, attributes: ['nome', 'placa'] } },
            ],
            order: [[Aluguel, 'id', 'DESC']]
        });
    }
}

module.exports = new UserRepository();
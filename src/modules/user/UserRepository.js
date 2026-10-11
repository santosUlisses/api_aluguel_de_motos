const User = require('../../models/User');
const Aluguel = require('../../models/Aluguel');
const Moto = require('../../models/Moto');
const { Op } = require('sequelize');

class UserRepository {
    async criar(dados) {
        return await User.create(dados);
    }
    async listar(limit, offset) {
        return await User.findAndCountAll({ limit, offset });
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
    async buscarAlugueis(id) {
        return await User.findOne({
            where: { id }, include: [
                { model: Aluguel, include: { model: Moto, attributes: ['nome', 'placa'] } },
            ],
            order: [[Aluguel, 'id', 'DESC']]
        });
    }
    async buscarPorFiltro({ filtro, limit, offset }) {
        return User.findAndCountAll({
            limit, offset, where: {
                [Op.or]: [
                    {
                        nome: { [Op.like]: `%${filtro}%` }
                    },
                    {
                        email: { [Op.like]: `%${filtro}%` }
                    }
                ]
            }
        });
    }
}

module.exports = new UserRepository();
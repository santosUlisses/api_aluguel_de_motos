const Moto = require('../../models/Moto');
const { Op } = require('sequelize');

class MotoRepository {
    async criar({ nome, marca, cor, placa, descricao }) {
        return await Moto.create({ nome, marca, cor, placa, descricao });
    }
    async listarMotos(limit, offset) {
        return await Moto.findAndCountAll({ limit, offset });
    }
    async buscarPlaca(placa) {
        return await Moto.findOne({ where: { placa } });
    }
    async buscarMotoId(id) {
        return await Moto.findOne({ where: { id } });
    }
    async deletarMoto(id) {
        return await Moto.destroy({ where: { id } });
    }
    async removerMotoUsuario(idMoto) {
        await Moto.update({ disponibilidade: "disponivel", UserId: null }, { where: { id: idMoto } });
    }
    async mudarDisponibilidade({ UserId, MotoId }, { transaction }) {
        return await Moto.update({ disponibilidade: "alugada", UserId }, { where: { id: MotoId }, transaction });
    }
    async editarMoto({ id, nome, marca, cor, placa, disponibilidade, descricao }) {
        return await Moto.update({ nome, marca, cor, placa, disponibilidade, descricao }, { where: { id } });
    }
    async buscarPorFiltro({ filtro }) {
        return await Moto.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        nome: { [Op.like]: `%${filtro}%` }
                    },
                    {
                        placa: { [Op.like]: `%${filtro}%` }
                    },
                ]
            }
        })
    }

}

module.exports = new MotoRepository();
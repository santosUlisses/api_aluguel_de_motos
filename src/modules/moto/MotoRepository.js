const Moto = require('../../../models/Moto');

class MotoRepository {
    async criar(nome, marca, cor, placa) {
        console.log(nome, marca, cor, placa);
        return await Moto.create({ nome, marca, cor, placa });
    }
    async verificarPlaca(placa) {
        return await Moto.findOne({ where: { placa } });
    }
    async verificarMoto(id) {
        return await Moto.findOne({ where: { id } });
    }
    async deletarMoto(id) {
        return await Moto.destroy({ where: { id } });
    }
    async removerMotoUsuario(idMoto) {
        await Moto.update({ disponibilidade: "disponivel", UserId: null }, { where: { id: idMoto } });
    }
    async mudarDisponibilidade(UserId, MotoId, transaction) {
        return await Moto.update({ disponibilidade: "alugada", UserId }, { where: { id: MotoId }, transaction });
    }
    async listarMotos() {
        return await Moto.findAll();
    }
}

module.exports = new MotoRepository();
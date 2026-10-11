const Revisao = require("../../models/Revisao");
const Moto = require("../../models/Moto");



class RevisaoRepository {
    async criarRevisao({ detalhes, valor, quilometragem, data_revisao, MotoId }) {
        return await Revisao.create({ detalhes, valor, quilometragem, data_revisao, MotoId });
    }
    async buscarRevisaoMoto(id) {
        return await Revisao.findAndCountAll({ include: [{ model: Moto, attributes: ["id", "nome", "placa"] }], where: { MotoId: id } });
    }
    async buscarRevisao(id) {
        return await Revisao.findOne({ where: { id } });
    }
    async editarRevisao({ id, detalhes, valor, quilometragem, data_revisao }) {
        return await Revisao.update({ detalhes, valor, quilometragem, data_revisao }, { where: { id } });
    }
    async deletarRevisao(id) {
        return await Revisao.destroy({ where: { id } });
    }
}
module.exports = new RevisaoRepository();
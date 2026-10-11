const Moto = require('../../models/Moto');
const Moto_Imagens = require('../../models/MotoImagens');


class MotoImagensRepository {
    async criar({ url, destaque, MotoId }) {
        return await Moto_Imagens.create({ url, destaque, MotoId });
    }
    async buscarImagensMoto(id) {
        return await Moto_Imagens.findAll({ where: { MotoId: id } });
    }
    async buscarImagensDestaque() {
        return await Moto_Imagens.findAll({ include: { model: Moto, attributes: ['nome', 'descricao'] }, where: { destaque: 1 } });
    }
    async buscarPorId(id) {
        return await Moto_Imagens.findOne({ where: { id } });
    }
    async buscarDestaqueMoto(id) {
        return await Moto_Imagens.findAll({ where: { MotoId: id, destaque: 1 } })
    }
    async editarDestaque(id, destaque) {
        return await Moto_Imagens.update({ destaque }, { where: { id } })
    }
    async deletar(id) {
        return await Moto_Imagens.destroy({ where: { id } });
    }
}

module.exports = new MotoImagensRepository();
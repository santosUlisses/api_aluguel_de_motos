const Comentario = require('../../models/Comentario');
const User = require('../../models/User');

class ComentarioRepository {
    async criar({ comentario, nota, UserId }) {
        return await Comentario.create({ comentario, nota, UserId })
    }
    async buscar({ limit, offset }) {
        return await Comentario.findAndCountAll({ limit, offset, include: { model: User, attributes: ['id', 'nome'] }, order: [['id', 'DESC']] });
    }
    async buscarAprovado() {
        return await Comentario.findAll({ include: { model: User, attributes: ['nome'] }, where: { status: "aprovado" } });
    }
    async buscarPorStatus({ limit, offset, status }) {
        return await Comentario.findAndCountAll({ limit, offset, include: { model: User, attributes: ['id', 'nome'] }, where: { status } });
    }
    async mediaNota() {
        return await Comentario.aggregate('nota', 'avg');
    }
    async mudarStatus({ id, status }) {
        return await Comentario.update({ status }, { where: { id } })
    }

}

module.exports = new ComentarioRepository();
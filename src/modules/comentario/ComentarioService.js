const AppError = require("../../shared/errors/AppError");
const ComentarioRepository = require("./ComentarioRepository");
const textUtils = require("../../utils/textUtils");


class ComentarioService {
    async criar({ comentario, nota, UserId }) {
        if (!comentario || !nota || !UserId) {
            throw new AppError("Algum dado necessário não foi fornecido", 400)
        }
        nota = Number(nota)
        comentario = textUtils.removerEspacosDuplicados(comentario);
        if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
            throw new AppError("A nota precisa ser um número inteiro entre 1 e 5");
        }
        return await ComentarioRepository.criar({ comentario, nota, UserId });
    }


    async buscar({ page, status }) {
        page = Math.max(Number(page) || 1, 1);
        const limit = 10;
        const offset = (page - 1) * limit;
        let comentarios;
        const mediaNota = await ComentarioRepository.mediaNota();
        if (status) {
            if (!['pendente', 'aprovado', 'reprovado'].includes(status)) {
                throw new AppError("Status inválido", 409);
            }
            comentarios = await ComentarioRepository.buscarPorStatus({ limit, offset, status });
        } else {
            comentarios = await ComentarioRepository.buscar({ limit, offset });
        }


        return {
            total: comentarios.count,
            paginaAtual: page,
            totalPaginas: Math.ceil(comentarios.count / limit),
            mediaAvaliacao: Number(mediaNota),
            comentarios: comentarios.rows.map((cf) => {
                return {
                    id: cf.id,
                    comentario: cf.comentario,
                    nota: cf.nota,
                    status: cf.status,
                    user_id: cf.UserId,
                    nome: cf.User.nome,
                }
            })
        };
    }

    async buscarAprovado() {
        const comentarios = (await ComentarioRepository.buscarAprovado()).map(c => c.get({ plain: true })).map(cf => {
            return {
                id: cf.id,
                nome: cf.User.nome,
                comentario: cf.comentario,
                nota: cf.nota,
            }
        });
        return comentarios;
    }

    async mudarStatus({ id, status }) {
        if (!id) {
            throw new AppError("ID não fornecido", 409);

        }
        if (!['aprovado', 'pendente', 'reprovado'].includes(status)) {
            throw new AppError("Valor inválido", 409);
        }
        return await ComentarioRepository.mudarStatus({ id, status });
    }

}

module.exports = new ComentarioService();
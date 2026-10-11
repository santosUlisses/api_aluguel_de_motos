const ComentarioService = require('../comentario/ComentarioService');

class ComentarioController {
    async criar(req, res) {
        const { comentario, nota, UserId } = req.body;
        try {
            await ComentarioService.criar({ comentario, nota, UserId });
            return res.status(201).json({ "message": "comentario enviado" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "Erro ao enviar comentário" });
        }
    }
    async buscar(req, res) {
        const { page, status } = req.query;
        try {
            const comentario = await ComentarioService.buscar({ page, status });
            return res.status(200).json(comentario);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "Falha ao buscar comentários" });
        }
    }
    async buscarAprovado(req, res) {
        const comentarios = await ComentarioService.buscarAprovado();
        return res.status(200).json(comentarios);
    }

    async mudarStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            await ComentarioService.mudarStatus({ id, status });
            return res.status(200).json({ "message": "status alterado!" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "Erro ao mudar status" });
        }
    }

}

module.exports = new ComentarioController();
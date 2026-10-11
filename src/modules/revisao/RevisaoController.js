const RevisaoService = require("./RevisaoService");

class RevisaoController {
    async criarRevisao(req, res) {
        const { detalhes, valor, quilometragem, data_revisao, MotoId } = req.body;
        try {
            await RevisaoService.criarRevisao(detalhes, valor, quilometragem, data_revisao, MotoId);
            return res.status(200).json({ "message": "Revisao criada com sucesso!" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async buscarRevisaoMoto(req, res) {
        const { id, page } = req.params;
        try {
            const revisao = await RevisaoService.buscarRevisaoMoto(id);
            return res.status(200).json(revisao);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async buscarRevisao(req, res) {
        const { id } = req.params;
        try {
            const revisao = await RevisaoService.buscarRevisao(id);
            return res.status(200).json({ revisao });

        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async editarRevisao(req, res) {
        const { id } = req.params;
        const { detalhes, valor, quilometragem, data_revisao } = req.body;
        try {
            await RevisaoService.editarRevisao({ id, detalhes, valor, quilometragem, data_revisao });
            return res.status(200).json({ "message": "Revisão atualizada!" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async deletarRevisao(req, res) {
        const { id } = req.params;
        try {
            await RevisaoService.deletarRevisao(id);
            return res.status(200).json({ "message": "Moto deletada com sucesso" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

}

module.exports = new RevisaoController();
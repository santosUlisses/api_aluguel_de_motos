const AluguelService = require('./AluguelService');

class AluguelController {


    async criarAluguel(req, res) {
        const { data_inicio, data_vencimento, valor_aluguel, UserId, MotoId } = req.body;
        try {
            await AluguelService.criarAluguel(data_inicio, data_vencimento, valor_aluguel, UserId, MotoId);
            return res.status(201).json({ "message": "aluguel criado" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async buscarAluguelId(req, res) {
        const { id } = req.params;
        try {
            const aluguel = await AluguelService.buscarAluguelId(id);

            return res.status(200).json(aluguel);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async alugueisUsuario(req, res) {
        const id = req.params.id;
        const page = req.query.page;
        try {
            const alugueis = await AluguelService.alugueisUsuario(id, page);
            return res.status(200).json(alugueis);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "erro inesperado" });
        }
    }

    async editarAluguel(req, res) {
        const { id } = req.params;
        const { data_vencimento, valor_aluguel, status } = req.body;
        try {
            await AluguelService.editarAluguel(id, data_vencimento, valor_aluguel, status);
            return res.status(200).json({ "message": "aluguel atualizado" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async alugueis(req, res) {
        const { status, page } = req.query;
        try {
            const alugueis = await AluguelService.alugueis({ status, page });
            return res.status(200).json(alugueis);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ message: error.message || "Erro no servidor" });
        }
    }

    async apagarAluguel(req, res) {
        const { id } = req.params;
        try {
            await AluguelService.apagarAluguel(id);
            res.status(200).json({ "message": "Aluguel apagado com sucesso" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }


}

module.exports = new AluguelController();
const AluguelService = require('./AluguelService');

class AluguelController {


    async criarAluguel(req, res) {
        const { data_inicio, data_vencimento, valor_aluguel, UserId, MotoId } = req.body;
        if (!data_inicio || !data_vencimento || !valor_aluguel || !UserId || !MotoId) {
            return res.status(400).json({ "message": "algum dado obrigatório não foi fornecido" });
        }
        try {
            await AluguelService.criar_aluguel(data_inicio, data_vencimento, valor_aluguel, UserId, MotoId);
            return res.status(201).json({ "message": "aluguel criado" });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async buscarAluguel(req, res) {
        const { id } = req.params;
        try {
            const aluguel = await AluguelService.buscarAluguel(id);
            res.status(200).json({ aluguel });
        } catch (error) {
            res.status(error.statusCode || 500).json({ "message": error.message });
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
        try {
            const alugueis = await AluguelService.alugueis();
            return res.status(200).json({ alugueis });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }


}

module.exports = new AluguelController();
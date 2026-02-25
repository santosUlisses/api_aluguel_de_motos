const MotoService = require('./MotoService');

class MotoController {
    async listarMotos(req, res) {
        try {
            const motos = await MotoService.listarMotos();
            return res.status(200).json({ motos });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async criarMoto(req, res) {
        const { nome, marca, cor, placa } = req.body;
        try {
            await MotoService.criar_moto(nome, marca, cor, placa);
            return res.status(201).json({ "message": "moto criada com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async deletarMoto(req, res) {
        const { id } = req.params;
        try {
            await MotoService.deletar_moto(id);
            return res.status(200).json({ "message": "Moto deletada" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
}

module.exports = new MotoController();
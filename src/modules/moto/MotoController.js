const MotoImagensService = require('../imagem/ImagensService');
const MotoService = require('./MotoService');

class MotoController {
    async criarMoto(req, res) {
        const { nome, marca, cor, placa, descricao } = req.body;
        try {
            await MotoService.criarMoto(nome, marca, cor, placa, descricao);
            return res.status(201).json({ "message": "moto criada com sucesso" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async listarMotos(req, res) {
        const { filtro, page } = req.query;
        try {

            const motos = await MotoService.listarMotos({ page, filtro });
            return res.status(200).json(motos);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }
    async buscarMotoId(req, res) {
        const { id } = req.params;
        try {
            const moto = await MotoService.buscarMotoId(id);
            return res.status(200).json(moto);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async editarMoto(req, res) {
        const { id } = req.params;
        const { nome, marca, cor, disponibilidade, placa, descricao } = req.body;
        try {
            await MotoService.editarMoto(id, nome, marca, cor, disponibilidade, placa, descricao);
            return res.status(200).json({ "message": "Moto atualizada!" });
        } catch (error) {
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
const ImagensService = require("./ImagensService");



class ImagensController {

    async criarImagem(req, res) {
        const MotoId = req.params.id;
        const { destaque } = req.body;
        const imagem = req.file;
        try {
            await ImagensService.criar_imagem(imagem, destaque, MotoId);
            return res.status(200).json({ "message": "Imagem criada com sucesso" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async buscarImagensMoto(req, res) {
        const { id } = req.params;
        try {
            const imagem = await ImagensService.buscar_imagens_moto(id);
            return res.status(200).json({ imagem });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async buscarImagensDestaque(req, res) {
        try {
            const imagens = await ImagensService.buscar_imagens_destaque();
            return res.status(200).json({ imagens });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "Erro ao comunicar com o servidor" });
        }
    }

    async editarDestaque(req, res) {
        const { id } = req.params;
        const { destaque } = req.body;
        try {
            await ImagensService.editar_destaque(id, destaque);
            return res.status(200).json({ "message": "Edição de destaque feita com sucesso" })
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async deletar_imagem(req, res) {
        const { id } = req.params;
        try {
            await ImagensService.deletar_imagem(id);
            return res.status(200).json({ "message": "Imagem apagada" });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "Erro inesperado" });
        }
    }

}

module.exports = new ImagensController();
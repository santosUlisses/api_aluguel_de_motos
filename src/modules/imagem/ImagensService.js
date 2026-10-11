const AppError = require("../../shared/errors/AppError");
const ImagensRepository = require("./ImagensRepository");
const fs = require("fs/promises")
const path = require('path');
const Service = require('../../shared/services/Service');

class MotoImagensService {
    async adicionarImagem({ url, destaque, MotoId }) {
        if (!url || !destaque || !MotoId) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        await ImagensRepository.adicionarImagem({ url, destaque, MotoId });

    }
    async criar_imagem(imagem, destaque, MotoId) {
        if (!imagem || !destaque || !MotoId) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        const url = await Service.processarImagem(imagem);

        return await ImagensRepository.criar({ url, destaque, MotoId });
    }

    async buscar_imagens_moto(id) {
        if (!id) {
            throw new AppError("ID não fornecido", 409);
        }
        const imagem = (await ImagensRepository.buscarImagensMoto(id)).map(m => m.get({ plain: true }));
        if (!imagem) {
            throw new AppError("Não tem imagens para essa moto", 404);
        }
        return imagem;
    }

    async editar_destaque(id, destaque) {
        if (!id || destaque == undefined) {
            throw new AppError("ID ou destaque não fornecido ", 409);
        }
        const existeImagem = await ImagensRepository.buscarPorId(id);
        if (!existeImagem) {
            throw new AppError("Imagem não encontrada", 404);
        }
        const existeDestaque = await ImagensRepository.buscarDestaqueMoto(existeImagem.MotoId);
        if (existeDestaque.length && destaque == 1) {
            throw new AppError("A moto já possui uma foto destaque, limite de 1 foto", 409)
        }
        await ImagensRepository.editarDestaque(id, destaque);
    }

    async buscar_imagens_destaque() {
        const imagens = (await ImagensRepository.buscarImagensDestaque()).map(m => m.get({ plain: true })).map(img => {
            return {
                id: img.id,
                url: img.url,
                destaque: img.destaque,
                id_moto: img.MotoId,
                nome: img.Moto.nome,
                descricao: img.Moto.descricao,
            }
        });
        if (imagens.length == 0) {
            return { "message": "Nenhuma imagem encontrada" };
        }
        return imagens;
    }

    async deletar_imagem(id) {
        if (!id) {
            throw new AppError("ID não fornecido", 409);
        }
        const imagem = await ImagensRepository.buscarPorId(id);
        if (!imagem) {
            throw new AppError("Imagem não encontrada", 404);
        }
        const filePath = path.resolve("uploads", path.basename(imagem.url));
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw new AppError(error, 500);
        }

        await ImagensRepository.deletar(id);
    }

}

module.exports = new MotoImagensService();
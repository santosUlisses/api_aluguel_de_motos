const AppError = require("../../shared/errors/AppError");
const RevisaoRepository = require("./RevisaoRepository");
const textUtils = require("../../utils/textUtils");
const dataUtils = require("../../utils/dataUtils");

class RevisaoService {
    async criarRevisao(detalhes, valor, quilometragem, data_revisao, MotoId) {
        if (!detalhes || !valor || !quilometragem || !data_revisao || !MotoId) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        const dadosLimpos = {
            detalhes: textUtils.removerEspacosDuplicados(detalhes),
            valor: parseFloat(valor),
            quilometragem: parseInt(quilometragem),
            data_revisao: dataUtils.validarAno(data_revisao),
            MotoId: MotoId
        }
        return await RevisaoRepository.criarRevisao(dadosLimpos);
    }

    async buscarRevisaoMoto(id, page) {
        page = Math.max(Number(page) || 1, 1)
        const limit = 10;
        const offset = (page - 1) * limit;
        const resultado = await RevisaoRepository.buscarRevisaoMoto(id);
        if (resultado.length == 0) {
            return { "message": "Aluguel não encontrado" };
        }

        return {
            total: resultado.count,
            currentPage: page,
            totalPages: Math.ceil(resultado.count / limit),
            revisoes: resultado.rows.map((rev) => {
                return {
                    id: rev.id,
                    valor: rev.valor,
                    detalhes: rev.detalhes,
                    quilometragem: rev.quilometragem,
                    data_revisao: rev.data_revisao,
                    id_moto: rev.Moto.id,
                    nome: rev.Moto.nome,
                    placa: rev.Moto.placa,
                }
            })
        }
    }

    async buscarRevisao(id) {
        const dados = (await RevisaoRepository.buscarRevisao(id)).get({ plain: true });
        if (!dados) {
            throw new AppError("Revisão não encontrada", 404);
        }
        const revisao = {
            id: dados.id,
            detalhes: dados.detalhes,
            valor: dados.valor,
            quilometragem: dados.quilometragem,
            data_revisao: dados.data_revisao,
            MotoId: dados.MotoId,
        }
        return revisao;
    }

    async editarRevisao({ id, detalhes, valor, quilometragem, data_revisao }) {
        if (!id || !detalhes || !valor || !quilometragem || !data_revisao) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        const existe = await RevisaoRepository.buscarRevisao(id);
        if (!existe) {
            throw new AppError("Revisão não encontrada", 404);
        }
        return await RevisaoRepository.editarRevisao({ id, detalhes, valor, quilometragem, data_revisao });
    }

    async deletarRevisao(id) {
        const existe = await RevisaoRepository.buscarRevisao(id);
        if (!existe) {
            throw new AppError("Revisão não encontrada", 404);
        }
        return await RevisaoRepository.deletarRevisao(id);
    }

}
module.exports = new RevisaoService();
const MotoRepository = require('./MotoRepository');
const AluguelRepository = require('../aluguel/AluguelRepository');
const AppError = require('../../shared/errors/AppError');
const MotoImagensService = require('../imagem/ImagensService');
const upload = require('../../shared/services/multer');
const MotoImagensRepository = require('../imagem/ImagensRepository');
const textUtils = require('../../utils/textUtils')


class Service_moto {
    async criarMoto(nome, marca, cor, placa, descricao) {
        if (!nome || !marca || !cor || !placa || !descricao) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        const existe = !!await MotoRepository.buscarPlaca(placa);
        if (existe) {
            throw new AppError('Placa já cadastrada no sistema', 409);
        }
        if (placa.length > 7 || placa.length < 7) {
            throw new AppError("Placa deve ter 7 carecteres", 409)
        }
        const dadosLimpos = {
            nome: textUtils.removerEspacosDuplicados(nome),
            marca: textUtils.capitalizarPalavras(marca),
            cor: textUtils.capitalizarPalavras(cor),
            placa: textUtils.maiusculo(placa),
            descricao: textUtils.removerEspacosDuplicados(descricao),
        }
        return await MotoRepository.criar(dadosLimpos);
    }


    async listarMotos({ page, filtro }) {
        page = Math.max(Number(page) || 1, 1);
        const limit = 10;
        const offset = (page - 1) * limit;
        let resultado;
        if (filtro) {
            resultado = await MotoRepository.buscarPorFiltro({ filtro });
        } else {
            resultado = await MotoRepository.listarMotos(limit, offset);
        }

        return {
            total: resultado.count,
            currentPage: page,
            totalPages: Math.ceil(resultado.count / limit),
            motos: resultado.rows.map(m => {
                return {
                    id: m.id,
                    nome: m.nome,
                    marca: m.marca,
                    cor: m.cor,
                    disponibilidade: m.disponibilidade,
                    descricao: m.descricao,
                    placa: m.placa
                }
            })
        }
    }

    async buscarMotoId(id) {
        if (!id) {
            throw new AppError("ID não fornecido", 400);
        }
        const moto = await MotoRepository.buscarMotoId(id);
        if (!moto) {
            throw new AppError("Moto não encontrada", 404);
        }
        return moto;
    }

    async editarMoto(id, nome, marca, cor, disponibilidade, placa, descricao) {
        if (!id || !nome || !marca || !cor || !disponibilidade || !placa || !descricao) {
            throw new AppError("Algum dado necessário não fornecido", 409);
        }
        const existePlaca = await MotoRepository.buscarPlaca(placa);
        if (existePlaca && existePlaca.id !== parseInt(id)) {
            throw new AppError("Placa já cadastrada no sistema", 409);
        }
        const existeMoto = await MotoRepository.buscarMotoId(id);
        if (!existeMoto) {
            throw new AppError("Moto não encontrada", 404);
        }
        const dadosLimpos = {
            id: parseInt(id),
            nome: textUtils.removerEspacosDuplicados(nome),
            marca: textUtils.capitalizarPalavras(marca),
            cor: textUtils.capitalizarPalavras(cor),
            disponibilidade: disponibilidade,
            placa: textUtils.maiusculo(placa),
            descricao: textUtils.removerEspacosDuplicados(descricao),
        }

        return await MotoRepository.editarMoto(dadosLimpos)
    }


    async removerMotoUsuario(idMoto) {
        const motoExiste = await MotoRepository.buscarMoto(idMoto);
        if (motoExiste) {
            return await MotoRepository.removerMotoUsuario(idMoto);
        }
        throw new AppError("Moto não encontrada no sistema", 404);
    }

    async deletar_moto(id) {
        const motoExiste = !!await MotoRepository.buscarMotoId(id);
        const existeAluguel = await AluguelRepository.buscarAluguelMoto(id);

        if (existeAluguel) {
            throw new AppError("Existe aluguel vinculado a moto", 409);
        }
        if (motoExiste) {
            return await MotoRepository.deletarMoto(id);
        }
        throw new AppError('Moto não encontrada', 404);
    }

}

module.exports = new Service_moto();
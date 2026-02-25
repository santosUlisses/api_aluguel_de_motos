const AppError = require('../../shared/errors/AppError');
const AluguelRepository = require('./AluguelRepository');
const MotoRepository = require('../moto/MotoRepository');
const sequelize = require('../../shared/db/db');




class AluguelService {

    async criar_aluguel(data_inicio, data_vencimento, valor_aluguel, UserId, MotoId) {
        const aluguel = !!await AluguelRepository.verificarAluguelAtivo(UserId, MotoId);
        if (aluguel) {
            throw new AppError("Já existe um aluguel ativo deste veículo para este usuário", 409);
        }
        if (!data_inicio || !data_vencimento || !valor_aluguel || !UserId || !MotoId) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        const transaction = await sequelize.transaction();
        try {
            await AluguelRepository.criarAluguel(data_inicio, data_vencimento, valor_aluguel, UserId, MotoId, transaction);
            await MotoRepository.mudarDisponibilidade(UserId, MotoId, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async buscarAluguel(id) {
        const dados = await AluguelRepository.buscarAluguel(id);
        const aluguel = {
            id: dados.id,
            data_vencimento: dados.data_vencimento,
            valor_aluguel: dados.valor_aluguel,
            status: dados.status,
            UserId: dados.UserId,
            usuario: dados.User.nome,
            moto: dados.Moto.nome,
            placa: dados.Moto.placa,
        }
        if (!aluguel) {
            throw new AppError("Aluguel não encontrado", 404);
        }
        return aluguel;
    }


    async editarAluguel(id, data_vencimento, valor_aluguel, status) {
        if (!id || !data_vencimento || !valor_aluguel || !status) {
            throw new AppError("Algum dado necessário não foi fornecido", 409);
        }
        const existeAluguel = !!await AluguelRepository.buscarAluguel(id);
        if (!existeAluguel) {
            throw new AppError("Aluguel não encontrado", 404);
        }
        return await AluguelRepository.editarAluguel(id, data_vencimento, valor_aluguel, status);

    }

    async alugueis() {
        const alugueis = await (await AluguelRepository.alugueis()).map(m => m.get({ plain: true })).map(
            alugueisF => {
                return {
                    id: alugueisF.id,
                    data_inicio: alugueisF.data_inicio,
                    data_vencimento: alugueisF.data_vencimento,
                    valor_aluguel: alugueisF.valor_aluguel,
                    status: alugueisF.status,
                    UserId: alugueisF.UserId,
                    MotoId: alugueisF.MotoId,
                    usuario: alugueisF.User?.nome || null,
                    moto: alugueisF.Moto?.nome || null,
                    placa: alugueisF.Moto?.placa || null,
                }
            })

        if (!alugueis) {
            throw new AppError("Nenhum aluguel disponivel", 200);
        }
        return alugueis;
    }

    async apagarAluguel(id) {
        const existe = await AluguelRepository.buscarAluguel(id);
        if (existe) {
            return await AluguelRepository.apagarAluguel(id);
        }
        throw new AppError("Aluguel não encontrado", 404);
    }

}

module.exports = new AluguelService();
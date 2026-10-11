const AppError = require('../../shared/errors/AppError');
const AluguelRepository = require('./AluguelRepository');
const MotoRepository = require('../moto/MotoRepository');
const sequelize = require('../../shared/db/db');
const PagamentoRepository = require('../pagamento/PagamentoRepository');
const UserRepository = require('../user/UserRepository');
const ValidarData = require('../../utils/dataUtils');



class AluguelService {

    async criarAluguel(data_inicio, data_vencimento, valor_aluguel, UserId, MotoId) {
        data_inicio = ValidarData.validarAno(data_inicio);
        data_vencimento = ValidarData.validarAno(data_vencimento);
        const aluguel = !!await AluguelRepository.verificarAluguelAtivo(UserId, MotoId);
        if (aluguel) {
            throw new AppError("Já existe um aluguel ativo deste veículo para este usuário", 409);
        }
        if (!data_inicio || !data_vencimento || !valor_aluguel || !UserId || !MotoId) {
            throw new AppError("Algum dado necessário não foi fornecido", 400);
        }
        const transaction = await sequelize.transaction();
        try {
            await AluguelRepository.criarAluguel({ data_inicio, data_vencimento, valor_aluguel, UserId, MotoId }, { transaction });
            await MotoRepository.mudarDisponibilidade({ UserId, MotoId }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async buscarAluguelId(id) {
        if (!id) {
            throw new AppError("ID não fornecido", 400);
        }
        const dados = await AluguelRepository.buscarAluguelId(id);
        if (!dados) {
            throw new AppError("Aluguel não encontrado", 404);
        }
        return {
            id: dados.id,
            data_vencimento: dados.data_vencimento,
            valor_aluguel: dados.valor_aluguel,
            status: dados.status,
            UserId: dados.UserId,
            usuario: dados.User.nome,
            id_moto: dados.Moto.id,
            moto: dados.Moto.nome,
            placa: dados.Moto.placa,
        }
    }

    async alugueisUsuario(id, page) {
        page = Math.max(Number(page) || 1, 1);
        const limit = 6;
        const offset = (page - 1) * limit;
        const [usuario, alugueis] = await Promise.all([
            UserRepository.buscarUsuarioId(id),
            AluguelRepository.alugueisUsuario(id, limit, offset),
        ]);

        return {
            usuario: {
                nome: usuario.nome,
                email: usuario.email,
            },
            total_alugueis: alugueis.count,
            currentPage: page,
            totalPages: Math.ceil(alugueis.count / limit),
            alugueis: alugueis.rows.map(a => {
                return {
                    id: a.id,
                    data_inicio: a.data_inicio,
                    data_vencimento: a.data_vencimento,
                    valor_aluguel: a.valor_aluguel,
                    status: a.status,
                    id_usuario: a.UserId,
                    id_moto: a.MotoId,
                    nome_moto: a.Moto.nome,
                    placa: a.Moto.placa,
                }
            })
        }

    }


    async editarAluguel(id, data_vencimento, valor_aluguel, status) {
        data_vencimento = ValidarData.validarAno(data_vencimento);
        if (!id || !data_vencimento || !valor_aluguel || !status) {
            throw new AppError("Algum dado necessário não foi fornecido", 400);
        }
        const existeAluguel = await this.buscarAluguelId(id);
        if (!existeAluguel) {
            throw new AppError("Aluguel não encontrado", 404);
        }
        if (status == "inativo") {
            return await Promise.all([
                MotoRepository.removerMotoUsuario(existeAluguel.id_moto),
                AluguelRepository.editarAluguel({ id, data_vencimento, valor_aluguel, status })
            ]);
        }
        return await AluguelRepository.editarAluguel({ id, data_vencimento, valor_aluguel, status });
    }


    async alugueis({ status, page }) {
        let dados;
        page = Math.max(Number(page) || 1, 1);
        const limit = 10;
        const offset = (page - 1) * limit;

        if (!status || status == "todos") {
            dados = await AluguelRepository.alugueis({ limit, offset });
        }
        else {
            dados = await AluguelRepository.buscarPorStatus({ limit, offset, status })
        }
        const alugueis = {
            total: dados.count,
            currentPage: page,
            totalPages: Math.ceil(dados.count / limit),
            alugueis: dados.rows.map(alugueisF => {
                return {

                    id: alugueisF.id,
                    data_inicio: alugueisF.data_inicio,
                    data_vencimento: alugueisF.data_vencimento,
                    valor_aluguel: alugueisF.valor_aluguel,
                    status: alugueisF.status,
                    UserId: alugueisF.UserId,
                    MotoId: alugueisF.MotoId,
                    usuario: alugueisF.User?.nome,
                    moto: alugueisF.Moto?.nome,
                    placa: alugueisF.Moto?.placa,
                }
            })
        }

        if (dados.rows.length == 0) {
            return { "message": "Nenhum aluguel encontrado" }
        }
        return alugueis;
    }

    async apagarAluguel(id) {
        if (!id) {
            throw new AppError("ID não fornecido", 400);
        }
        const existeAluguel = await this.buscarAluguelId(id);
        const existePagamento = await PagamentoRepository.pagamentoPorAluguel(id);
        if (!existeAluguel.id) {
            throw new AppError("Aluguel não encontrado", 404);
        }

        if (!existePagamento.id) {
            return await Promise.all([
                MotoRepository.removerMotoUsuario(existeAluguel.id_moto),
                AluguelRepository.apagarAluguel(id),

            ]);
        }
        throw new AppError("Não foi possível apagar aluguel, existe pagamento relacionado", 409);
    }

}

module.exports = new AluguelService();
const { Sequelize } = require('sequelize');
const AppError = require('../../shared/errors/AppError');
const AluguelRepository = require('../aluguel/AluguelRepository');
const PagamentoRepository = require('./PagamentoRepository');
const sequelize = require('../../shared/db/db');
const ValidarData = require('../../utils/dataUtils');


class PagamentoService {

    async pagamentos(page) {
        page = Math.max(Number(page) || 1, 1)
        const limit = 10;
        const offset = (page - 1) * limit;
        const [resultado, totalPagamentos] = await Promise.all([
            PagamentoRepository.pagamentos(limit, offset),
            PagamentoRepository.somarPagamentos()
        ])
        if (resultado.rows.length == 0) {
            return { "message": "Nenhum pagamento registrado" }
        }
        return {
            total: resultado.count,
            currentPage: page,
            totalPages: Math.ceil(resultado.count / limit),
            totalPagamentos: totalPagamentos,
            pagamentos: resultado.rows.map(p => {
                return {
                    id: p.id,
                    data_pagamento: p.data_pagamento,
                    valor_pago: p.valor_pago,
                    id_aluguel: p.AluguelId,
                    id_usuario: p.UserId,
                    usuario: p.User.nome
                }
            })
        }

    }

    async pagamentoPorUsuario(id, page) {
        const limit = 10;
        const offset = (page - 1) * limit;
        page = Math.max(Number(page) || 1, 1);
        const pagamentos = await PagamentoRepository.pagamentoPorUsuario({ id, limit, offset });
        return {
            total: pagamentos.count,
            currentPage: page,
            totalPages: Math.ceil(pagamentos.count / limit),
            pagamentos: pagamentos.rows.map(m => {
                return {
                    id: m.id,
                    data_pagamento: m.data_pagamento,
                    valor_pago: m.valor_pago,
                    UserId: m.UserId,
                    AluguelId: m.AluguelId,
                }
            })
        };
    }

    async buscarPagamento(id) {
        const pagamento = await PagamentoRepository.buscarPagamento(id);
        if (!pagamento) {
            return { "message": "Pagamento não encontrado" }
        }
        return pagamento
    }

    async criarPagamento({ id, novo_vencimento, valor_pago, UserId }) {
        valor_pago = parseFloat(valor_pago);
        novo_vencimento = ValidarData.validarAno(novo_vencimento);
        const transaction = await sequelize.transaction();
        const aluguel = await AluguelRepository.buscarAluguelId(id);
        if (!aluguel) {
            throw new AppError("Aluguel não encontrado", 404);
        }
        if (Number.isNaN(valor_pago)) {
            throw new AppError("Valor inválido", 400)
        }
        const data_pagamento = new Date().toISOString().split("T")[0];
        const data_vencimento = novo_vencimento;
        try {
            await PagamentoRepository.criarPagamento({ id, data_pagamento, valor_pago, UserId }, { transaction })
            await AluguelRepository.editarVencimento({ id, data_vencimento }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new AppError("transação malsucedida", 409);
        }

    }

}

module.exports = new PagamentoService();
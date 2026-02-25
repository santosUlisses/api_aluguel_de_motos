const Aluguel = require('../models/Aluguel')
const Moto = require('../models/Moto')
const Pagamentos = require('../models/Pagamento')
const User = require('../models/User')
const moment = require('moment');



class Consulta {
    home(req, res) {
        res.json({ "message": "hello world" });
    }
    async logado(req, res) {
        res.status(200).json({ "message": "logado" });
    }

    testando(req, res) {
        const { nome, algo } = req.body;
        console.log({ nome, algo });
        res.status(200).json({ "message": "enviado", nome, algo });
    }




    async criarPagamento(req, res) {
        const { data_pagamento, valor_pago, UserId, AluguelId } = req.body;
        try {
            await Pagamentos.create({ data_pagamento, valor_pago, UserId, AluguelId });
            return res.status(201).json({ "message": "pagamento registrado!" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ "message": "erro ao criar" });

        }
    }


    async listarUltimo(req, res) {
        const last = await User.max('id')
        const dados = await User.findOne({ where: { id: last }, include: [{ model: Moto }, { model: Aluguel }, { model: Pagamentos }] });
        res.status(200).json({ dados });
    }




    async filterAluguelUser(req, res) {
        const UserId = req.params.UserId;
        try {
            const alugueisAtivos = await Aluguel.findAll({ where: { UserId: UserId, status: "ativo" } });
            return res.status(200).json({ alugueisAtivos });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ "message": "error interno" });
        }
    }



    async totalPagamentos(req, res) {
        const totalPago = await Pagamentos.sum('valor_pago');
        res.status(200).json({ totalPago })
    }

    async totalAluguel(req, res) {
        const dataHoje = moment().format('YYYY-MM-DD');
        const totalAlugueis = await Aluguel.sum('valor_aluguel');
        const alugueis = await Aluguel.findAll();
        const alugueisEmAberto = alugueis.filter(a => a.data_vencimento >= dataHoje).map(m => m.get({ plain: true }));
        const alugueisEmDebito = alugueis.filter(a => a.data_vencimento <= dataHoje).map(m => m.get({ plain: true }));
        const somaAluguelAberto = alugueisEmAberto.map(a => Number(a.valor_aluguel)).reduce((a, t) => a + t, 0);
        const somaAluguelDebito = alugueisEmDebito.map(a => Number(a.valor_aluguel)).reduce((a, t) => a + t, 0);

        res.status(200).json({ totalAlugueis, alugueisEmAberto, somaAluguelAberto, alugueisEmDebito, somaAluguelDebito });
    }




}



module.exports = new Consulta();
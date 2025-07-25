const Aluguel = require('../models/Aluguel')
const Moto = require('../models/Moto')
const Pagamentos = require('../models/Pagamentos')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const enviarEmail = require('../services/enviarEmail');
const moment = require('moment');



class Consulta {
    home(req, res) {
        res.json({ "message": "hello world" });
    }
    async logado(req, res) {
        res.status(200).json({ "message": "logado" });
    }


    async criarUser(req, res) {
        const { nome, email, senha } = req.body;
        try {
            const validar = await User.findOne({ where: { email: email } });
            if (!!validar) {
                res.status(409).json({ "message": "email já cadastrado" });
                return
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ "message": "error on server" });
        }
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);


        try {
            await User.create({ nome, email, senha: senhaHash });
            res.status(201).json({ "message": "success" });
            enviarEmail.enviarEmail(email);
        } catch (error) {
            console.log(error);
        }
    }

    async criarMoto(req, res) {
        const { nome, marca, cor } = req.body;
        try {
            await Moto.create({ nome, marca, cor, disponibilidade: "disponivel" });
            return res.status(201).json({ "message": "moto criada com sucesso" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ "message": "não foi possível criar moto" });

        }
    }

    async criarAluguel(req, res) {
        const { data_inicio, data_vencimento, valor_aluguel, UserId, MotoId } = req.body;
        try {
            Promise.all([
                Aluguel.create({ data_inicio, data_vencimento, valor_aluguel, status: "ativo", UserId, MotoId }),
                Moto.update({ status: "alugada", UserId }, { where: { id: MotoId } })
            ])
            return res.status(201).json({ "message": "aluguel criado" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ "message": "não foi possível criar" });

        }
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

    async listarTudo(req, res) {
        const dados = await User.findAll({ include: [{ model: Moto }, { model: Aluguel }, { model: Pagamentos }] });
        res.status(200).json({ dados });

    }

    async listarUltimo(req, res) {
        const last = await User.max('id')
        const dados = await User.findOne({ where: { id: last }, include: [{ model: Moto }, { model: Aluguel }, { model: Pagamentos }] });
        res.status(200).json({ dados });
    }

    async listarDadosUser(req, res) {
        const id = req.params.id
        const dados = await User.findAll({ include: [{ model: Moto }, { model: Aluguel }, { model: Pagamentos }], where: { id } });
        return res.status(200).json({ dados });
    }

    async listarMotos(req, res) {
        const motos = await Moto.findAll();
        res.status(200).json({ motos });
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

    async authUser(req, res) {
        const { email, senha } = req.body;
        console.log(email);
        if (!email || !senha) {
            res.status(400).json({ "message": "Email e senha são obrigatórios." });
            return
        }
        try {
            const user = await User.findOne({ where: { email: email } });
            if (user) {
                const auth = await bcrypt.compare(senha, user.senha);
                if (auth === true) {
                    const token = jwt.sign({ id: user.id }, process.env.keySecret, { expiresIn: '10min' });
                    res.status(200).json({ token });
                } else {
                    res.status(401).json({ "message": "não autorizado" });
                }
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ "message": "error on server" });
        }
    }

    async atualizarUser(req, res) {
        const { id, nome, email, senha } = req.body;
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        if (!id || !nome || !email || !senha) {
            res.status(409).json({ "message": "todos os campos tem que ser preenchido" });
            return
        }

        try {
            await User.update({ nome, email, senha: senhaHash }, { where: { id } });
            res.status(200).json({ "message": "dados atualizados." });
        } catch (error) {
            console.log(error)
            res.status(500).json({ "message": "error on server" });
        }
    }
    async atualizarAluguel(req, res) {
        const { id, data_vencimento, valor_aluguel, status } = req.body;

        try {
            await Aluguel.update({ data_vencimento, valor_aluguel, status }, { where: { id } });
            res.status(201).json({ "message": "aluguel atualizado" });
        } catch (error) {
            console.log(error);
            res.status(409).json({ "message": "erro ao atualizar aluguel" });
        }
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        try {
            await User.destroy({ where: { id } });
            res.status(200).json({ "message": "Deletado" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ "message": "error ao deletar" });
        }
    }

    async deleteMoto(req, res) {
        const idMoto = req.body;
        try {
            await Moto.destroy({ where: { id: idMoto } });
            return res.status(200).json({ "message": "moto deletada" });
        } catch (error) {
            console.log(error);
            return res.status(404).json({ "message": "id não encontrado" });
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

    async removerMotoUser(req, res) {
        const idMoto = req.body.idMoto;
        try {
            await Moto.update({ disponibilidade: "disponivel", UserId: 1 }, { where: { id: idMoto } });
            res.status(409).json({ "message": "moto removida com sucesso" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ "message": "erro no servidor" });

        }
    }



}



module.exports = new Consulta();
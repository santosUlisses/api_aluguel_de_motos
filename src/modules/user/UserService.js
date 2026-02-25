const UserRepository = require('./UserRepository');
const AppError = require('../../shared/errors/AppError')
const authToken = require('../../../middleware/Token');
const bcrypt = require('bcrypt');
const Service = require('../../shared/services/Service')


class UserService {
    async criar_usuario(nome, email, senha) {
        const usuario = await UserRepository.buscarEmail(email);
        if (usuario) {
            throw new AppError('Conta já cadastrada', 409);
        }
        const senhaHash = await Service.criarSenha(senha)

        await UserRepository.criar({ nome, email, senha: senhaHash });
        Service.enviarEmail(email);
    }
    async usuarios() {
        const usuarios = (await UserRepository.listar()).map(m => m.get({ plain: true })).map(usuarioF => {
            return {
                id: usuarioF.id,
                nome: usuarioF.nome,
                email: usuarioF.email,
            }
        });
        if (!usuarios) {
            throw new AppError("Nenhum usuário encontrado", 404);
        }
        return usuarios;
    }

    async login(email, senha) {
        const usuario = await UserRepository.buscarEmail(email);
        if (usuario) {
            const auth = await bcrypt.compare(senha, usuario.senha);
            if (auth) {
                const token = authToken.gerarToken(usuario.id);
                return { usuario, token };
            }
            throw new AppError("Senha inválida", 401);
        }
        throw new AppError("Email inválido", 404);
    }

    async editar_dados(id, nome, email, senha) {
        const usuario = await UserRepository.buscarUsuarioId(id);
        const senhaHash = await Service.criarSenha(senha)
        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }
        if (email !== usuario.email) {
            const emailExiste = await UserRepository.buscarEmail(email);
            if (emailExiste) {
                throw new AppError("Email já cadastrado", 409)
            }
        }
        await UserRepository.editarDados({ id, nome, email, senha: senhaHash });
    }

    async buscarDadosId(id) {
        const usuario = await UserRepository.buscarDadosId(id);
        const dados = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            alugueis:
                usuario.Aluguels?.map(a => {
                    return {
                        id_aluguel: a.id,
                        data_inicio: a.data_inicio,
                        data_vencimento: a.data_vencimento,
                        valor_aluguel: a.valor_aluguel,
                        status: a.status,
                        MotoId: a.MotoId,
                        moto: a.Moto.nome,
                        placa: a.Moto.placa,

                    }
                }) || null

        }
        if (!usuario) {
            throw new AppError("Dados não encontrados", 404);
        }
        return dados;
    }
}

module.exports = new UserService();
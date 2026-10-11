const UserRepository = require('./UserRepository');
const AppError = require('../../shared/errors/AppError')
const authToken = require('../../middleware/Autenticar');
const bcrypt = require('bcrypt');
const Service = require('../../shared/services/Service')
const validator = require('validator');
const textUtils = require('../../utils/textUtils');


class UserService {
    async criar_usuario(nome, email, senha) {
        if (!validator.isEmail(email)) {
            throw new AppError("Email inválido", 400);
        }
        nome = textUtils.capitalizarPalavras(nome);
        const usuario = await UserRepository.buscarEmail(email);
        if (usuario) {
            throw new AppError('Conta já cadastrada', 409);
        }
        const senhaHash = await Service.criarSenha(senha)

        await UserRepository.criar({ nome, email, senha: senhaHash });
        Service.enviarEmail(email);
    }

    async usuarios(page) {
        page = Math.max(Number(page) || 1, 1);
        const limit = 10;
        const offset = (page - 1) * limit;
        const usuarios = await UserRepository.listar(limit, offset);
        if (usuarios.length <= 0) {
            return { "message": "Nenhum usuário cadastrado" }
        }

        return {
            total: usuarios.count,
            currentPage: page,
            totalPages: Math.ceil(usuarios.count / limit),
            usuarios: usuarios.rows.map((u) => {
                return {
                    id: u.id,
                    nome: u.nome,
                    email: u.email,
                }
            })
        }

    }

    async buscarPorFiltro({ filtro, page }) {
        page = Math.max(Number(page) || 1, 1);
        const limit = 10;
        const offset = (page - 1) * limit
        const usuarios = await UserRepository.buscarPorFiltro({ filtro, limit, offset });
        return {
            total: usuarios.count,
            currentPage: page,
            totalPages: Math.ceil(usuarios.count / limit),
            usuarios: usuarios.rows.map((u) => {
                return {
                    id: u.id,
                    nome: u.nome,
                    email: u.email,
                }
            })
        };
    }

    async login(email, senha) {
        if (!email || !senha) {
            throw new AppError("Email e senha são obrigatórios", 400)
        }
        if (!validator.isEmail(email)) {
            throw new AppError("Email inválido", 400);
        }
        const usuario = await UserRepository.buscarEmail(email);
        if (!usuario) {
            throw new AppError("Email ou senha inválidos", 401)
        }
        const autenticacao = await bcrypt.compare(senha, usuario.senha);
        if (!autenticacao) {
            throw new AppError("Senha inválida", 401);
        }
        const token = authToken.gerarToken(usuario);

        return {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nome: usuario.nome,
                tipo_usuario: usuario.tipo_usuario,
            }, token
        };
    }

    async buscarUsuario(id) {
        const existe = await UserRepository.buscarUsuarioId(id);
        if (!existe) {
            throw new AppError("Usuário não encontrado", 404);
        }
        const usuario = {
            id: existe.id,
            nome: existe.nome,
            email: existe.email,
        }
        return usuario;
    }

    async editar_dados({ id, nome, email, senha }) {
        const usuario = await UserRepository.buscarUsuarioId(id);
        const senhaHash = await Service.criarSenha(senha);
        if (!id || !nome || !email || !senha) {
            throw new AppError("Algum dado necessário não foi fornecido", 400);
        }
        if (!validator.isEmail(email)) {
            throw AppError("Email inválido", 400)
        }
        if (!usuario) {
            throw new AppError("Usuário não encontrado", 404);
        }
        if (email !== usuario.email) {
            const emailExiste = !! await UserRepository.buscarEmail(email);
            if (emailExiste) {
                throw new AppError("Email já cadastrado", 409)
            }
        }
        await UserRepository.editarDados({ id, nome, email, senha: senhaHash });
    }

    async buscarAlugueis(id) {
        const usuario = await UserRepository.buscarAlugueis(id);
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
            return { "message": "usuário não encontrado" }
        }
        return dados;
    }



}

module.exports = new UserService();
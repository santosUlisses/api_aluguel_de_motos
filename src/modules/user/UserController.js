const UserService = require('./UserService');
const MotoService = require('../moto/MotoService');

class UserController {

    async criarUsuario(req, res) {
        const { nome, email, senha } = req.body;
        try {
            await UserService.criar_usuario(nome, email, senha);
            return res.status(201).json({ "message": "Conta criada com sucesso" });
        }
        catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }


    async autenticarLogin(req, res) {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ "message": "email ou senha não fornecido" });
        }
        try {
            const dados = await UserService.login(email, senha);
            return res.status(200).json(dados);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async buscarUsuario(req, res) {
        const { id } = req.params;
        try {
            const usuario = await UserService.buscarUsuario(id);
            return res.status(200).json({ usuario });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message || "erro inesperado" });
        }
    }

    async editarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, senha } = req.body;
        try {
            await UserService.editar_dados({ id, nome, email, senha });
            return res.status(200).json({ "message": "dados atualizados." });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await User.destroy({ where: { id } });
            return res.status(200).json({ "message": "Deletado" });
        } catch (error) {
            return res.status(500).json({ "message": "error ao deletar" });
        }
    }



    async removerMotoUser(req, res) {
        const { id } = req.params;
        try {
            await MotoService.removerMotoUsuario(id);
            return res.status(409).json({ "message": "moto removida com sucesso" });
        } catch (error) {
            return res.status(error.statusCode).json({ "message": error.message });
        }
    }


    async usuarios(req, res) {
        const { filtro, page } = req.query;
        let usuarios;
        try {
            usuarios = await UserService.usuarios(page);
            if (filtro) {
                usuarios = await UserService.buscarPorFiltro({ filtro, page });
                return res.status(200).json(usuarios);
            }
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }

    }
    async buscarAlugueis(req, res) {
        const { id } = req.params;
        try {
            const usuario = await UserService.buscarAlugueis(id);
            return res.status(200).json({ usuario });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async buscarPorFiltro(req, res) {
        const { filtro } = req.query;
        try {
            const dados = await UserService.buscarPorFiltro({ filtro });
            return res.status(200).json({ dados });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

}



module.exports = new UserController();
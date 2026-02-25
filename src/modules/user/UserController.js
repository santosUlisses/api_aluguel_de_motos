const UserService = require('./UserService');
const MotoService = require('../moto/MotoService');

class UserController {

    async criarUsuario(req, res) {
        const { nome, email, senha } = req.body;
        try {
            await UserService.criar_usuario(nome, email, senha);
            res.status(201).json({ "message": "Conta criada com sucesso" });
        }
        catch (error) {
            console.log(error)
            res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }


    async autenticarLogin(req, res) {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ "message": "email ou senha não fornecido" });
        }
        try {
            const dados = await UserService.login(email, senha);
            res.status(200).json(dados);
        } catch (error) {
            res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async editarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, senha } = req.body;
        if (!id || !nome || !email || !senha) {
            return res.status(400).json({ "message": "todos os campos tem que ser preenchido" });
        }
        try {
            await UserService.editar_dados(id, nome, email, senha);
            res.status(200).json({ "message": "dados atualizados." });
        } catch (error) {
            console.log(error)
            res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await User.destroy({ where: { id } });
            res.status(200).json({ "message": "Deletado" });
        } catch (error) {
            console.log(error)
            res.status(500).json({ "message": "error ao deletar" });
        }
    }


    async listarDadosUser(req, res) {
        const { id } = req.params;
        const dados = await User.findAll({ include: [{ model: Moto }, { model: Aluguel }, { model: Pagamentos }], where: { id } });
        return res.status(200).json({ dados });
    }


    async removerMotoUser(req, res) {
        const { id } = req.params;
        try {
            await MotoService.removerMotoUsuario(id);
            return res.status(409).json({ "message": "moto removida com sucesso" });
        } catch (error) {
            console.log(error);
            res.status(error.statusCode).json({ "message": error.message });
        }
    }


    async usuarios(req, res) {
        try {
            const usuarios = await UserService.usuarios();
            return res.status(200).json({ usuarios });
        } catch (error) {
            return res.status(error.statusCode || 500).json({ "message": error.message });
        }

    }
    async buscarDadosId(req, res) {
        const { id } = req.params;
        try {
            const usuario = await UserService.buscarDadosId(id);
            return res.status(200).json({ usuario });
        } catch (error) {
            res.status(error.statusCode || 500).json({ "message": error.message });
        }
    }

}



module.exports = new UserController();
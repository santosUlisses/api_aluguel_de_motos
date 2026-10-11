const jwt = require('jsonwebtoken');



class Autenticar {
    gerarToken(usuario) {
        const token = jwt.sign({ id: usuario.id, tipo_usuario: usuario.tipo_usuario }, process.env.keySecret, { expiresIn: '60min' });
        return token
    }

    autenticar(req, res, next) {
        const autorizacao = req.headers['authorization'];

        const token = autorizacao.split(" ")[1];
        if (!token) {
            return res.status(401).json({ "message": "token nao fornecido" });
        }

        jwt.verify(token, process.env.keySecret, (error, user) => {
            if (error) {
                return res.status(403).json({ "message": "token inválido ou expirado" });
            }
            req.user = user;
            next();
        });
    }



}


module.exports = new Autenticar();
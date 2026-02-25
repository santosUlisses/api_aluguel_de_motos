const jwt = require('jsonwebtoken');



class Token {
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

    gerarToken(id) {
        const token = jwt.sign({ id: id }, process.env.keySecret, { expiresIn: '10min' });
        return token
    }


}


module.exports = new Token();
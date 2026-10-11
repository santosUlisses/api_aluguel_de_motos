class Autorizar {
    admin(req, res, next) {
        if (req.user?.tipo_usuario !== "admin") {
            return res.status(403).json({ "message": "Não autorizado" });
        }
        next();
    }
    usuario(req, res, next) {

        if (Number(req.params.id) !== req.user.id && req.user.tipo_usuario !== "admin") {
            return res.status(403).json({ "message": "Não autorizado" })
        }
        next();
    }
}

module.exports = new Autorizar();
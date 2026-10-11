const AppError = require("../shared/errors/AppError");

class ValidarData {
    validarAno(data) {
        const ano = new Date(data).getFullYear();
        if (ano < 2026 || ano > 2050) {
            throw new AppError("O ano deve estar entre 2026 e 2050", 400)
        }
        return data;
    }
}

module.exports = new ValidarData();
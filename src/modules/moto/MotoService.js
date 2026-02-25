const MotoRepository = require('./MotoRepository');
const AppError = require('../../shared/errors/AppError')

class Service_moto {
    async criar_moto(nome, marca, cor, placa) {
        const existe = !!await MotoRepository.verificarPlaca(placa);
        if (existe) {
            throw new AppError('Placa já cadastrada no sistema', 409);
        }
        return await MotoRepository.criar(nome, marca, cor, placa);
    }
    async deletar_moto(id) {
        const motoExiste = !!await MotoRepository.verificarMoto(id);
        if (motoExiste) {
            return await MotoRepository.deletarMoto(id);
        }
        throw new AppError('Moto não encontrada', 404);
    }
    async removerMotoUsuario(idMoto) {
        const motoExiste = await MotoRepository.verificarMoto(idMoto);
        if (motoExiste) {
            return await MotoRepository.removerMotoUsuario(idMoto);
        }
        throw new AppError("Moto não encontrada no sistema", 404);
    }
    async listarMotos() {
        const motos = await MotoRepository.listarMotos()
        if (motos.length > 0) {
            return motos
        }
        throw new AppError("Nenhuma moto encontrada", 404);
    }

}

module.exports = new Service_moto();
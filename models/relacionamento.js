const User = require('./User');
const Moto = require('./Moto');
const Aluguel = require('./Aluguel');
const Pagamento = require('./Pagamento');
const Revisao = require('./Revisao');

User.hasMany(Moto);
Moto.belongsTo(User);


User.hasMany(Aluguel);
Aluguel.belongsTo(User);


Moto.hasMany(Aluguel);
Aluguel.belongsTo(Moto);


User.hasMany(Pagamento);
Pagamento.belongsTo(User);


Aluguel.hasMany(Pagamento);
Pagamento.belongsTo(Aluguel);

Moto.hasMany(Revisao);
Revisao.belongsTo(Moto);


module.exports = {
    User,
    Moto,
    Aluguel,
    Pagamento
};

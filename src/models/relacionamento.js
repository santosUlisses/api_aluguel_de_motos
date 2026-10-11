const User = require('./User');
const Moto = require('./Moto');
const Aluguel = require('./Aluguel');
const Pagamento = require('./Pagamento');
const Revisao = require('./Revisao');
const MotoImagens = require('./MotoImagens');
const Comentario = require('./Comentario');

User.hasMany(Moto);
Moto.belongsTo(User);


User.hasMany(Aluguel);
Aluguel.belongsTo(User);


User.hasMany(Pagamento);
Pagamento.belongsTo(User);


User.hasMany(Comentario);
Comentario.belongsTo(User);


Moto.hasMany(Aluguel);
Aluguel.belongsTo(Moto);


Moto.hasMany(Revisao);
Revisao.belongsTo(Moto);

Moto.hasMany(MotoImagens);
MotoImagens.belongsTo(Moto);


Aluguel.hasMany(Pagamento);
Pagamento.belongsTo(Aluguel);



module.exports = {
    User,
    Moto,
    Aluguel,
    Pagamento,
    MotoImagens,
    Comentario,
};

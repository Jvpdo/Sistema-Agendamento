const { Sequelize, DataTypes } = require('sequelize');
const Usuario = require('./Usuario'); // Importante para a relação

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});

const Agendamento = sequelize.define('Agendamento', {
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado', 'concluido'),
        defaultValue: 'pendente'
    },
    servico: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'agendamentos' });

// Criando a relação: Um Agendamento pertence a um Usuário
Agendamento.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Agendamento;
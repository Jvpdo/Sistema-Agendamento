const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');
const Usuario = require('./Usuario');

// Inicializa usando a config do Aiven (SSL incluído)
const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    config.development
);

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
}, { 
    tableName: 'agendamentos',
    underscored: true,
    timestamps: true 
});

// Definindo a relação: Um Agendamento pertence a um Usuário
// Usamos a foreignKey 'usuario_id' para bater com o que definimos no Controller
Agendamento.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = Agendamento;
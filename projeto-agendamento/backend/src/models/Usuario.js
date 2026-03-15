const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

// Inicializa a conexão usando a configuração que funcionou na migration (com SSL)
const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    config.development // Aqui já estão inclusos host, port, dialect e dialectOptions (SSL)
);

const Usuario = sequelize.define('Usuario', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('cliente', 'admin'),
        defaultValue: 'cliente'
    }
}, {
    tableName: 'usuarios',
    underscored: true, // Garante compatibilidade com created_at / updated_at se configurado na migration
    timestamps: true
});

// Importante: Se você for definir relacionamentos em um arquivo separado, 
// pode remover a linha abaixo. Caso contrário, mantenha para referência.
Usuario.associate = (models) => {
    Usuario.hasMany(models.Agendamento, { foreignKey: 'usuario_id' });
};

module.exports = Usuario;
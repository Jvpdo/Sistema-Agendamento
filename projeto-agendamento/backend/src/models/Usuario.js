const { Sequelize, DataTypes } = require('sequelize');
// Importaremos a conexão do banco aqui
const sequelize = new Sequelize(
    process.env.DB_NAME || 'sistema_agendamento',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '123456',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
    }
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
    timestamps: true // Cria automaticamente colunas createdAt e updatedAt
});

module.exports = Usuario;
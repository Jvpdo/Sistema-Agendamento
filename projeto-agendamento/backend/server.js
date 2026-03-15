require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');

// Importação dos Models
const Usuario = require('./src/models/Usuario');
const Agendamento = require('./src/models/Agendamento');

const app = express();

// 1. Middlewares
app.use(cors({
  origin: '*', // Permite acesso de qualquer lugar (Vercel, celular, etc)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'] // ADICIONE ISSO AQUI
}));
app.use(express.json());

// 2. Rotas
app.use(routes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: "API do Sistema de Agendamento Rodando! 🚀" });
});

// 3. Função Principal de Inicialização
async function startServer() {
    try {
        // O Sequelize já está configurado dentro dos seus Models
        // Vamos usar a instância que já existe no Model de Usuário
        await Usuario.sequelize.authenticate();
        console.log('✅ Conexão com o MySQL estabelecida com sucesso.');

        // Sincronização das Tabelas (Ordem importa por causa das relações)
        await Usuario.sync({ alter: true });
        await Agendamento.sync({ alter: true });
        const userExists = await Usuario.findByPk(1);
if (!userExists) {
    await Usuario.create({
        id: 1,
        nome: "Administrador",
        email: "admin@teste.com",
        senha: "123",
        tipo: "admin"
    });
    console.log("👤 Usuário de teste criado com sucesso!");
}
        console.log("✅ Tabelas sincronizadas (Usuários e Agendamentos).");

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });
        
    } catch (error) {
        console.error('❌ Erro ao iniciar o servidor ou banco de dados:', error);
    }
}

// Inicia tudo
startServer();
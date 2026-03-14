const express = require('express');
const routes = express.Router();
const UsuarioController = require('./controllers/UsuarioController');
const AgendamentoController = require('./controllers/AgendamentoController'); // Importe aqui

// Rotas de usuários
routes.post('/usuarios', UsuarioController.store);
routes.get('/usuarios', UsuarioController.index);

// Rotas de Agendamento
routes.post('/agendamentos', AgendamentoController.store);
routes.get('/agendamentos', AgendamentoController.index);

// Rota para atualizar o status do agendamento
routes.put('/agendamentos/:id', AgendamentoController.update);

module.exports = routes;


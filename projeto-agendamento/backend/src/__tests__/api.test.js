const request = require('supertest');
const express = require('express');
const routes = require('../routes');

const app = express();
app.use(express.json());
app.use(routes);

// Rota de teste simples para garantir que o servidor responde
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('✅ Testes de Sistema', () => {
  
  // Teste 1: Verifica se a API está online
  it('Deve responder com status 200 na rota de saúde', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  // Teste 2: Verifica se uma rota inexistente retorna 404
  it('Deve retornar 404 para rotas que não existem', async () => {
    const response = await request(app).get('/rota-inexistente');
    expect(response.statusCode).toBe(404);
  });

});
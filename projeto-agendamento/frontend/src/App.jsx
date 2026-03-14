import React, { useEffect, useState, useCallback } from 'react';
import api from './services/api';
import './App.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servico, setServico] = useState('');
  const [dataHora, setDataHora] = useState('');

  const loadAgendamentos = useCallback(async () => {
    try {
      const response = await api.get('/agendamentos');
      setAgendamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  }, []);

  useEffect(() => {
  const fetchAgendamentos = async () => {
    try {
      const response = await api.get('/agendamentos');
      setAgendamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  };

  fetchAgendamentos();
}, []);

  const contagemStatus = {
    pendente: agendamentos.filter(a => a.status === 'pendente').length,
    confirmado: agendamentos.filter(a => a.status === 'confirmado').length,
    cancelado: agendamentos.filter(a => a.status === 'cancelado').length,
  };

  const dataGrafico = {
    labels: ['Pendente', 'Confirmado', 'Cancelado'],
    datasets: [
      {
        data: [
          contagemStatus.pendente,
          contagemStatus.confirmado,
          contagemStatus.cancelado
        ],
        backgroundColor: ['#ffcd56', '#4bc0c0', '#ff6384'],
        hoverOffset: 4,
      },
    ],
  };

  const handleAgendar = async (e) => {
    e.preventDefault();

    try {
      await api.post('/agendamentos', {
        usuario_id: 1,
        servico: servico,
        data_hora: dataHora
      });

      setServico('');
      setDataHora('');

      await loadAgendamentos();

      alert("Agendamento realizado com sucesso! 🎉");

    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
      alert("Erro ao agendar. Verifique se o backend está ligado.");
    }
  };

  const handleStatus = async (id, novoStatus) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      loadAgendamentos(); // Recarrega a lista e o gráfico automaticamente!
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status.");
    }
  };

  return (
    <div className="container">

      <header>
        <h1>📅 Sistema de Agendamentos</h1>
      </header>

      <div className="dashboard-layout">

        <aside className="stats-panel">

          <section className="chart-container">
            <h3>Resumo de Status</h3>
            <div style={{ width: '250px', margin: '0 auto' }}>
              <Doughnut data={dataGrafico} />
            </div>
          </section>

          <section className="form-section">
            <h2>Novo Agendamento</h2>

            <form onSubmit={handleAgendar} className="form-inline">

              <input
                type="text"
                placeholder="Ex: Banho e Tosa"
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                required
                aria-label="Descrição do serviço"
              />

              <input
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                required
                aria-label="Data e hora"
              />

              <button type="submit">
                Agendar Agora
              </button>

            </form>
          </section>

        </aside>

        <main className="list-section">

          <h2>Lista de Horários</h2>

          <div className="card-grid">

            {agendamentos.length === 0 ? (
              <p>Nenhum agendamento para mostrar.</p>
            ) : (
              agendamentos.map((agenda) => (
                <div key={agenda.id} className="card">

                  <div className="card-header">
                    <h3>{agenda.servico}</h3>
                    <span className={`status ${agenda.status}`}>
                      {agenda.status}
                    </span>
                  </div>

                  <p>
                    <strong>👤 Cliente:</strong> {agenda.Usuario?.nome || 'Cliente 1'}
                  </p>

                  <p>
                    <strong>⏰ Horário:</strong> {new Date(agenda.data_hora).toLocaleString('pt-BR')}
                  </p>

                  <div className="card-actions">
      {agenda.status === 'pendente' && (
        <button onClick={() => handleStatus(agenda.id, 'confirmado')} className="btn-confirm">
          Confirmar
        </button>
      )}
      {agenda.status !== 'cancelado' && (
        <button onClick={() => handleStatus(agenda.id, 'cancelado')} className="btn-cancel">
          Cancelar
        </button>
      )}
    </div>

                </div>
              ))
            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default App;
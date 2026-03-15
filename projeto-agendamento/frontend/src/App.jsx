import React, { useEffect, useState, useCallback } from 'react';
import api from './services/api';
import './App.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Componente Principal da Aplicação
 * Gerencia agendamentos, análise de dados e interface do usuário.
 */
function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servico, setServico] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [busca, setBusca] = useState('');

  // Lógica de Busca: Filtra a lista original baseada no termo digitado
  const agendamentosFiltrados = agendamentos.filter(agenda => 
    agenda.servico.toLowerCase().includes(busca.toLowerCase())
  );

  // Função para carregar dados da API
  const loadAgendamentos = useCallback(async () => {
    try {
      const response = await api.get('/agendamentos');
      setAgendamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      toast.error("Erro ao carregar agendamentos.");
    }
  }, []);

  // Carrega os dados ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      await loadAgendamentos();
    };

    fetchData();
  }, [loadAgendamentos]);

  // Processamento de dados para o Gráfico
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

  // Criação de novo agendamento
  const handleAgendar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/agendamentos', {
        usuario_id: 1, // ID fixo para teste conforme regra de negócio inicial
        servico: servico,
        data_hora: dataHora
      });

      setServico('');
      setDataHora('');
      await loadAgendamentos();
      toast.success("Agendamento realizado com sucesso! 🎉");
    } catch (err) {
      console.error("Erro ao salvar agendamento:", err);
      toast.error("Erro ao agendar. Verifique a conexão com o servidor.");
    }
  };

  // Atualização de Status (Confirmar/Cancelar)
  const handleStatus = async (id, novoStatus) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      await loadAgendamentos();
      toast.info(`Status alterado para ${novoStatus}`);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      toast.error("Erro ao atualizar status.");
    }
  };

  // Exclusão de registro
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      try {
        await api.delete(`/agendamentos/${id}`);
        await loadAgendamentos();
        toast.success("Registro removido.");
      } catch (err) {
        console.error("Erro ao excluir:", err);
        toast.error("Erro ao excluir registro.");
      }
    }
  };

  return (
    <div className="container">
      <header>
        <h1>📅 Sistema de Agendamentos</h1>
      </header>

      <div className="dashboard-layout">
        {/* Painel Lateral: Gráfico e Formulário */}
        <aside className="stats-panel">
          <section className="chart-container">
            <h3>Resumo de Status</h3>
            <div style={{ width: '250px', margin: '0 auto' }}>
              <Doughnut data={dataGrafico} />
            </div>
          </section>

          <section className="form-section">
            <h2>Novo Agendamento</h2>
            <form onSubmit={handleAgendar} className="form-vertical">
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
              <button type="submit">Agendar Agora</button>
            </form>
          </section>
        </aside>

        {/* Painel Principal: Busca e Listagem */}
        <main className="list-section">
          <div className="list-header">
            <h2>Lista de Horários</h2>
            <input 
              type="text" 
              placeholder="🔍 Buscar serviço..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="card-grid">
            {agendamentosFiltrados.length === 0 ? (
              <div className="empty-state">
                <p>Nenhum agendamento encontrado.</p>
              </div>
            ) : (
              agendamentosFiltrados.map((agenda) => (
                <div key={agenda.id} className="card">
                  <div className="card-header">
                    <h3>{agenda.servico}</h3>
                    <span className={`status ${agenda.status}`}>
                      {agenda.status}
                    </span>
                  </div>

                  <p><strong>👤 Cliente:</strong> {agenda.Usuario?.nome || 'Cliente Padrão'}</p>
                  <p><strong>⏰ Horário:</strong> {new Date(agenda.data_hora).toLocaleString('pt-BR')}</p>

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

                  {/* Lógica de exclusão: disponível para cancelados ou datas passadas */}
                  {(agenda.status === 'cancelado' || new Date(agenda.data_hora) < new Date()) && (
                    <button onClick={() => handleDelete(agenda.id)} className="btn-delete">
                      🗑️ Excluir Registro
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Componente de notificações flutuantes */}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
}

export default App;
// Importamos apenas os Models que já estão configurados (com o SSL que ajustamos)
const Agendamento = require('../models/Agendamento');
const Usuario = require('../models/Usuario');

module.exports = {
    /**
     * Criar um novo agendamento
     */
    async store(req, res) {
        try {
            const { usuario_id, data_hora, servico } = req.body;

            // Verifica se o usuário existe antes de agendar
            const usuario = await Usuario.findByPk(usuario_id);
            if (!usuario) {
                return res.status(400).json({ error: 'Usuário não encontrado.' });
            }

            const agendamento = await Agendamento.create({
                usuario_id,
                data_hora,
                servico
            });

            return res.json(agendamento);
        } catch (error) {
            console.error("Erro na Store:", error);
            return res.status(500).json({ error: 'Erro ao criar agendamento.' });
        }
    },

    /**
     * Listar todos os agendamentos (Dashboard)
     */
    async index(req, res) {
        try {
            const agendamentos = await Agendamento.findAll({
                // O include funciona porque a relação está definida nos Models
                include: [{ model: Usuario, attributes: ['nome', 'email'] }]
            });
            return res.json(agendamentos);
        } catch (error) {
            console.error("Erro na Index:", error);
            return res.status(500).json({ error: 'Erro ao listar agendamentos.' });
        }
    },

    /**
     * Atualizar status (Confirmar/Cancelar)
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const agendamento = await Agendamento.findByPk(id);
            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }

            agendamento.status = status;
            await agendamento.save();

            return res.json(agendamento);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
        }
    },

    /**
     * Excluir agendamento
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const agendamento = await Agendamento.findByPk(id);

            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado.' });
            }

            await agendamento.destroy();
            return res.json({ message: 'Agendamento removido com sucesso.' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao excluir agendamento.' });
        }
    }
};
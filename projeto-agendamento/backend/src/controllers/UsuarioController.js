const Usuario = require('../models/Usuario');

module.exports = {
    async store(req, res) {
        try {
            const { nome, email, senha, tipo } = req.body;

            // Verifica se o usuário já existe
            const usuarioExiste = await Usuario.findOne({ where: { email } });
            if (usuarioExiste) {
                return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            }

            const usuario = await Usuario.create({ nome, email, senha, tipo });
            
            // Não devolvemos a senha no JSON por segurança
            usuario.senha = undefined;

            return res.json(usuario);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao criar usuário.' });
        }
    },

    async index(req, res) {
        try {
            const usuarios = await Usuario.findAll({
                attributes: ['id', 'nome', 'email', 'tipo', 'createdAt'] // Esconde a senha
            });
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar usuários.' });
        }
    },
};
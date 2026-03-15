const Usuario = require('../models/Usuario');

module.exports = {
    /**
     * Criar um novo usuário
     * @route POST /usuarios
     */
    async store(req, res) {
        try {
            const { nome, email, senha, tipo } = req.body;

            // Verifica se o e-mail já está em uso para evitar duplicidade no banco
            const usuarioExiste = await Usuario.findOne({ where: { email } });
            
            if (usuarioExiste) {
                return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
            }

            const usuario = await Usuario.create({ 
                nome, 
                email, 
                senha, 
                tipo 
            });
            
            // Segurança: Removemos o campo senha do objeto antes de enviar a resposta
            const usuarioResponse = usuario.toJSON();
            delete usuarioResponse.senha;

            return res.status(201).json(usuarioResponse);
        } catch (error) {
            console.error("Erro no cadastro de usuário:", error);
            return res.status(500).json({ error: 'Erro ao criar usuário no servidor.' });
        }
    },

    /**
     * Listar todos os usuários
     * @route GET /usuarios
     */
    async index(req, res) {
        try {
            // Buscamos apenas os campos necessários, omitindo a senha por padrão
            const usuarios = await Usuario.findAll({
                attributes: ['id', 'nome', 'email', 'tipo', 'createdAt']
            });
            
            return res.json(usuarios);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({ error: 'Erro ao listar usuários no servidor.' });
        }
    },
};
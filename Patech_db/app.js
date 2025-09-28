const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) // transforma em número 
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco:', err.stack);
    }
    console.log('Conectado ao PostgreSQL!');
    release();
});

const JWT_SECRET = process.env.JWT_SECRET || 'um_segredo_bem_forte';

// Middleware para verificar token
function autenticarToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ mensagem: 'Não autenticado' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: 'Token inválido' });
    }
}

// CADASTRO
app.post('/cadastro', async (req, res) => {
    const { nome, cpf, email, senha } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO Usuarios (nome, cpf, email, senha)
            VALUES ($1, $2, $3, $4)
            RETURNING id_usuario, nome, email;
        `;
        const values = [nome, cpf, email, senhaHash];

        const result = await pool.query(query, values);

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        if (error.code === '23505') {
            return res.status(409).json({ mensagem: 'E-mail ou CPF já cadastrado.' });
        }
        res.status(500).json({ mensagem: 'Erro do servidor.' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const query = 'SELECT id_usuario, nome, senha FROM Usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        }

        const usuario = result.rows[0];
        const match = await bcrypt.compare(senha, usuario.senha);

        if (!match) {
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign({ id: usuario.id_usuario }, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            usuario: { id: usuario.id_usuario, nome: usuario.nome }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});

// BUSCAR DADOS DO USUÁRIO LOGADO
app.get('/me', autenticarToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id_usuario, nome, email, cpf FROM Usuarios WHERE id_usuario = $1',
            [req.userId]
        );
        if (result.rows.length === 0) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao buscar usuário' });
    }
});

// LOGOUT
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ mensagem: 'Logout realizado com sucesso!' });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// auenticaçao da conta e chamar os dados para a tela de usuario
app.put('/me', autenticarToken, async (req, res) => {
    const { nome, email, cpf } = req.body;

    try {
        const result = await pool.query(
            `UPDATE Usuarios 
             SET nome = $1, email = $2, cpf = $3 
             WHERE id_usuario = $4
             RETURNING id_usuario, nome, email, cpf`,
            [nome, email, cpf, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

        res.json({
            mensagem: 'Dados atualizados com sucesso!',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ mensagem: 'Erro do servidor' });
    }
});
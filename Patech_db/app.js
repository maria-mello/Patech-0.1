// Importa o framework Express para criar o servidor.
const express = require('express');
const { Pool } = require('pg');
// Importa o CORS para permitir que seu frontend acesse a API.
const cors = require('cors');
require('dotenv').config(); 

// Cria a instância do aplicativo Express.
const app = express();
// Define a porta do servidor.
const port = 3000;

// Middleware: Permite que o Express leia as requisições no formato JSON
app.use(express.json());
app.use(cors()); 

// Cria o pool de conexões com base nas variáveis do .env (ajuste as chaves se precisar).
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, // Deve ser 'patech_db'
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Testa a conexão ao iniciar o servidor.
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados:', err.stack);
    }
    console.log('Conectado ao PostgreSQL!');
    release(); // funcionando
});

// CADASTRO 
app.post('/cadastro', async (req, res) => {
    const { nome, cpf, email, senha } = req.body;

    try {
        const query = `
            INSERT INTO Usuarios (nome, cpf, email, senha)
            VALUES ($1, $2, $3, $4)
            RETURNING id_usuario, nome, email;
        `;
        const values = [nome, cpf, email, senha]; 
        
        const result = await pool.query(query, values);

        //Funcionou
        res.status(201).json({ 
            mensagem: 'Usuário cadastrado com sucesso!', 
            usuario: result.rows[0] 
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        // Tratamento para CPF ou Email duplicado (UNIQUE constraint)
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
        // Busca o usuário pelo e-mail.
        const query = 'SELECT id_usuario, nome, senha FROM Usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        }

        const usuario = result.rows[0];
        
        //Compara a senha
        const match = (senha === usuario.senha);
        if (match) {
            // Sucesso no login
            return res.status(200).json({ 
                mensagem: 'Login realizado com sucesso!', 
                usuario: { id: usuario.id_usuario, nome: usuario.nome }
            });
        } else {
            // Senha incorreta.
            return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor da API rodando em http://localhost:${port}`);
});

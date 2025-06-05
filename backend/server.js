//Inicio
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'minha_chave_secreta_123';


//Middlewares
app.use(cors());
app.use(express.json());

//Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor funcionando!'});
});

//Rota de cadastro
app.post('/api/register', async (req, res) => {
    const{ username, email, password } = req.body;

//Verificar se todos os campos foram enviados
if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios'});
}
console.log('Tentativa de cadastro:', {username, email});

//Verificar se o usuário já existe
db.get('SELECT * FROM users WHERE email = ? OR username = ? ', [email, username], async(err, row) => {
    if (err) {
        console.error('Erro no banco:', err);
        return res.status(500).json({error:'Erro no servidor'});
    }
    if (row) {
        return res.status(400).json({error:'Usuario ou email já existe'});
    }
    try{
        //Criptografia senha
        const hashedPassword = await bcrypt.hash(password,10);

        //Inserir usuario  no banco
        db.run('INSERT INTO users (username, email, password) VALUES(?, ?, ?)',
            [username, email, hashedPassword],
            function (err) {
                if(err) {
                    console.error('Erro ao inserir:', err);
                    return res.status(500).json({error:'Erro ao criar usuário' });
                }
                console.log('Usuario criado com ID', this.lastID);
                res.json({
                    message: 'Usuário criado com sucesso',
                    user: { id: this.lastID, username, email }
                });
            }
        );
    } catch (error) {
        console.error('Erro na criptografia', error);
        res.status(500).json ({ error: 'Erro no servidor'});
    }
});
});

//Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

});

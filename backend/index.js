// 1. Importar as bibliotecas
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors'); // Habilita a comunicação entre o jogo e o servidor

// 2. Inicializar o Express
const app = express();
app.use(express.json());
app.use(cors());

// 3. Configurar a porta do servidor
const port = process.env.PORT || 3000;

// 4. Conectar ao Firebase
// Certifique-se de que o arquivo serviceAccountKey.json está na mesma pasta
const serviceAccount = require('./serviceAccountKey.json');

// O URL do seu banco de dados Firebase
// Substitua o placeholder pelo ID do seu projeto, que você encontra em Configurações do Projeto > Geral
const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount)
};

admin.initializeApp(firebaseConfig);

const db = admin.firestore();

// 5. Rota para obter o ranking
app.get('/ranking', async (req, res) => {
    try {
        const rankingRef = db.collection('ranking').orderBy('pontuacao', 'desc').limit(10);
        const snapshot = await rankingRef.get();

        const ranking = [];
        snapshot.forEach(doc => {
            ranking.push(doc.data());
        });

        res.status(200).json(ranking);
    } catch (error) {
        console.error("Erro ao buscar ranking: ", error);
        res.status(500).send("Erro interno do servidor.");
    }
});

// 6. Rota para salvar uma nova pontuação
app.post('/ranking', async (req, res) => {
    try {
        const { nome, pontuacao } = req.body;
        
        if (!nome || pontuacao === undefined) {
            return res.status(400).send("Nome e pontuação são obrigatórios.");
        }

        await db.collection('ranking').add({
            nome: nome,
            pontuacao: pontuacao,
            data: admin.firestore.FieldValue.serverTimestamp()
        });
        
        res.status(201).send("Pontuação salva com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar pontuação: ", error);
        res.status(500).send("Erro interno do servidor.");
    }
});

// 7. Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
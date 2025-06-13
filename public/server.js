import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de diretório para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados com lowdb
const adapter = new JSONFile('db.json');
const defaultData = { usuarios: [], formularios: [], respostas: [] };
const db = new Low(adapter, defaultData);
await db.read();
db.data ||= defaultData;
await db.write();

// Middleware para disponibilizar db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Rotas
import usuariosRoute from './routes/usuarios.js';
import formulariosRoute from './routes/formularios.js';
import respostasRoute from './routes/respostas.js';

app.use('/api/usuarios', usuariosRoute);
app.use('/api/formularios', formulariosRoute);
app.use('/api/respostas', respostasRoute);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

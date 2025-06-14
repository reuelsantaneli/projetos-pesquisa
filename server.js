
const express = require('express');
const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const app = express();
const PORT = process.env.PORT || 3000;

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/formularios', async (req, res) => {
  await db.read();
  res.json(db.data.formularios || []);
});

app.get('/api/respostas', async (req, res) => {
  await db.read();
  res.json(db.data.respostas || []);
});

app.post('/formularios', async (req, res) => {
  await db.read();
  db.data.formularios.push({ id: nanoid(), ...req.body, concluido: false });
  await db.write();
  res.status(200).send('Formulário criado');
});

app.post('/respostas', async (req, res) => {
  await db.read();
  db.data.respostas.push({ id: nanoid(), ...req.body });
  await db.write();
  res.status(200).send('Resposta salva');
});

app.post('/registro', async (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  await db.read();
  const existe = db.data.usuarios.find(u => u.email === email);
  if (existe) return res.status(400).send('Usuário já existe');
  db.data.usuarios.push({ id: nanoid(), nome, email, senha, tipo });
  await db.write();
  res.redirect('/login.html');
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  await db.read();
  const user = db.data.usuarios.find(u => u.email === email && u.senha === senha);
  if (!user) return res.status(401).send('Credenciais inválidas');
  res.redirect(user.tipo === 'admin' ? '/dashboard.html' : '/responder-formulario.html');
});

app.listen(PORT, async () => {
  await db.read();

  if (!db.data) {
    db.data = { usuarios: [], formularios: [], respostas: [] };
    await db.write();
  }

  console.log('Servidor rodando em http://localhost:' + PORT);
});

import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json(req.db.data.usuarios);
});

router.post('/', async (req, res) => {
  const novoUsuario = req.body;
  const existe = req.db.data.usuarios.find(u => u.email === novoUsuario.email);
  if (existe) return res.status(400).json({ message: 'Usuário já registrado' });
  req.db.data.usuarios.push(novoUsuario);
  await req.db.write();
  res.status(201).json(novoUsuario);
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = req.db.data.usuarios.find(u => u.email === email && u.senha === senha);
  if (usuario) res.json(usuario);
  else res.status(401).json({ message: 'Login inválido' });
});

export default router;

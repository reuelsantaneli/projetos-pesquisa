import express from 'express';
import { nanoid } from 'nanoid';
const router = express.Router();

router.get('/', (req, res) => {
  res.json(req.db.data.usuarios);
});

router.post('/', async (req, res) => {
  const novoUsuario = req.body;
  const existe = req.db.data.usuarios.find(u => u.email === novoUsuario.email);
  if (existe) return res.status(400).json({ message: 'Usuário já registrado' });
  novoUsuario.id = nanoid();
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

// Editar usuário (PUT /api/usuarios/:id)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, nivel } = req.body;
  const usuario = req.db.data.usuarios.find(u => u.id === id);
  if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });
  usuario.email = email;
  usuario.nivel = nivel;
  await req.db.write();
  res.json(usuario);
});

// Excluir usuário (DELETE /api/usuarios/:id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const index = req.db.data.usuarios.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: 'Usuário não encontrado' });
  req.db.data.usuarios.splice(index, 1);
  await req.db.write();
  res.status(204).end();
});

export default router;

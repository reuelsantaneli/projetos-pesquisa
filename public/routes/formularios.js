import express from 'express';
const router = express.Router();

// Retorna todos os formulários
router.get('/', (req, res) => {
  res.json(req.db.data.formularios);
});

// Retorna um formulário pelo id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const formulario = req.db.data.formularios.find(f => f.id === id);
  if (!formulario) return res.status(404).json({ message: 'Formulário não encontrado' });
  res.json(formulario);
});

// Salva novo formulário
router.post('/', async (req, res) => {
  const novoFormulario = req.body;
  req.db.data.formularios.push(novoFormulario);
  await req.db.write();
  res.status(201).json(novoFormulario);
});

// Edita/conclui um formulário pelo id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const idx = req.db.data.formularios.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Formulário não encontrado' });
  req.db.data.formularios[idx] = { ...req.body, id };
  await req.db.write();
  res.json(req.db.data.formularios[idx]);
});

// Exclui um formulário pelo id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const idx = req.db.data.formularios.findIndex(f => f.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Formulário não encontrado' });
  req.db.data.formularios.splice(idx, 1);
  await req.db.write();
  res.status(204).end();
});

export default router;
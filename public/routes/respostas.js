import express from 'express';
const router = express.Router();

// Retorna todas as respostas de um formulário específico
router.get('/:formularioId', (req, res) => {
  const { formularioId } = req.params;
  const respostas = req.db.data.respostas.filter(r => r.formularioId === formularioId);
  res.json(respostas);
});

// Retorna todas as respostas (para o mapa)
router.get('/', (req, res) => {
  res.json(req.db.data.respostas);
});

// Salva nova resposta
router.post('/', async (req, res) => {
  const novaResposta = req.body;
  // Garante email (do front) e data atual do servidor
  novaResposta.email = req.body.email || null;
  novaResposta.data = new Date().toISOString();

  req.db.data.respostas.push(novaResposta);
  await req.db.write();
  res.status(201).json(novaResposta);
});

export default router;

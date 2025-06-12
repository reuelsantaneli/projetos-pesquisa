import 'dotenv/config';
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();

// permite ler JSON no body das requisições
app.use(express.json());

// Inicializa o Supabase com as vars do .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase   = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL ou SUPABASE_ANON_KEY não configurados');
  process.exit(1);
}

// Rota de login
app.post('/api/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res
      .status(400)
      .json({ error: 'Email e senha são obrigatórios.' });
  }

  // autentica com Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    return res
      .status(401)
      .json({ error: error.message });
  }

  // devolve usuário e sessão
  return res.json({
    user:    data.user,
    session: data.session
  });
});

// (Opcional) rota de teste rápido
app.get('/', (_req, res) => {
  res.send('Olá, mundo!');
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

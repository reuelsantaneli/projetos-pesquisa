// api/usuarios/login.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email, senha } = req.body;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const { data: session, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json({ user: session.user, session });
}

// api/usuarios/login.js
import { createClient } from '@supabase/supabase-js'

// Cliente anônimo para login
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, senha } = req.body
  if (!email || !senha) {
    return res.status(400).json({ error: 'Faltando email ou senha' })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error) {
    return res.status(401).json({ error: error.message })
  }

  return res.status(200).json({ session: data.session, user: data.user })
}

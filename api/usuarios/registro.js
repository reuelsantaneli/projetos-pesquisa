// api/usuarios/registro.js
import { createClient } from '@supabase/supabase-js'

// Cliente admin com Service Role Key (só use nesta rota)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, senha } = req.body
  if (!email || !senha) {
    return res.status(400).json({ error: 'Faltando email ou senha' })
  }

  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,    // força o usuário como “confirmado”
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(201).json({ user })
  } catch (err) {
    console.error('Erro no registro:', err)
    return res.status(500).json({ error: 'Erro interno ao criar usuário' })
  }
}

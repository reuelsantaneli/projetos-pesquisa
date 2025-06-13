// api/usuarios/registro.js
import { createClient } from '@supabase/supabase-js'

// 1) instância “admin” com SERVICE_ROLE_KEY
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  const { email, senha } = req.body

  // validações mínimas
  if (!email || !senha) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
  }

  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter ao menos 6 caracteres.' })
  }

  // cria usuário forçando confirmação
  const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,   // força já confirmado
  })

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  // não devolvemos a service key nem nada sensível
  return res.status(201).json({ user })
}

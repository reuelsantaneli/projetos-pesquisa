// api/usuarios/registro.js
import { createClient } from '@supabase/supabase-js'

// 1) Inicialize dois clients: um “anon” (se precisar no futuro) e um admin
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// client público/anônimo (não usado aqui, mas deixo para referência)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// client admin (service role) — tem permissão para criar usuários
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res) {
  // 2) Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 3) Extraia os campos do corpo
  const { email, senha } = req.body
  if (!email || !senha) {
    return res.status(400).json({ error: 'Faltando email ou senha' })
  }

  try {
    // 4) Crie o usuário forçando confirmação
    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,    // força o usuário como “confirmado”
    })

    if (error) {
      // pode ser senha fraca, email existente…
      return res.status(400).json({ error: error.message })
    }

    // 5) Retorne o objeto criado (ou apenas o id, se quiser)
    return res.status(201).json({ user })
  } catch (err) {
    console.error('Erro no registro:', err)
    return res.status(500).json({ error: 'Erro interno ao criar usuário' })
  }
}

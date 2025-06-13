// api/usuarios/registro.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  
);

export default async function handler(req, res) {
  const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });
  }

  const { email, senha } = req.body


  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,   
  })
  // —————————————————

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  return res.status(201).json({ user })
}

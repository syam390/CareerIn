import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <div className="card">
      <h2>Login / Sign up</h2>
      {sent ? <p>Check your email for a magic link.</p> :
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        {error && <p style={{color:'crimson'}}>{error}</p>}
        <button className="btn" type="submit">Send Magic Link</button>
      </form>
      }
    </div>
  )
}

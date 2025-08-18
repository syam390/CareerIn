import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(()=>{
    let mounted = true
    supabase.auth.getUser().then(({ data }) => { if (mounted) setUser(data.user) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return ()=> sub.subscription.unsubscribe()
  },[])

  return (
    <nav className="nav">
      <Link href="/"><a>Feed</a></Link>
      <Link href="/jobs"><a>Jobs</a></Link>
      <Link href="/u/me"><a>My Profile</a></Link>
      <div style={{flex:1}} />
      {!user ? <Link href="/login"><a>Login</a></Link> :
        <button className="btn secondary" onClick={()=>supabase.auth.signOut()}>Logout</button>}
    </nav>
  )
}

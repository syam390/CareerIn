import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PublicProfile(){
  const router = useRouter(); const { username } = router.query
  const [profile, setProfile] = useState(null)

  useEffect(()=>{
    (async ()=>{
      if (!username) return
      const { data } = await supabase.from('profiles').select('*').eq('username', username).single()
      setProfile(data)
    })()
  },[username])

  if (!profile) return <div className="card">Loading...</div>

  return (
    <div className="card">
      <h2>{profile.full_name}</h2>
      <div>@{profile.username}</div>
      <div style={{marginTop:8}}>{profile.headline}</div>
      {profile.skills && <div style={{marginTop:8}}><strong>Skills:</strong> {profile.skills.join(', ')}</div>}
    </div>
  )
}

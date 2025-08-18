import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function JobDetail(){
  const router = useRouter(); const { id } = router.query
  const [job, setJob] = useState(null)
  const [applied, setApplied] = useState(false)

  const load = async ()=>{
    if (!id) return
    const { data } = await supabase.from('jobs').select('*').eq('id', id).single()
    setJob(data)
    const u = await supabase.auth.getUser(); if (u.data.user) {
      const { data: app } = await supabase.from('applications').select('*').eq('job_id', id).eq('user_id', u.data.user.id)
      setApplied((app?.length ?? 0) > 0)
    }
  }

  useEffect(()=>{ load() },[id])

  const apply = async ()=>{
    const u = await supabase.auth.getUser(); if (!u.data.user) { alert('Login first'); return }
    const cover = prompt('Optional cover letter:')
    const { error } = await supabase.from('applications').insert({ job_id: id, cover_letter: cover ?? null }).select()
    if (error) alert(error.message); else { alert('Applied ✅'); setApplied(true) }
  }

  if (!job) return <div className="card">Loading...</div>

  return (
    <div className="card">
      <h2>{job.title}</h2>
      <div>{job.company} • {job.location}</div>
      <p style={{marginTop:8}}>{job.description}</p>
      <div style={{marginTop:12}}>
        {!applied ? <button className="btn" onClick={apply}>Apply</button> : <span className="badge">Applied</span>}
      </div>
    </div>
  )
}

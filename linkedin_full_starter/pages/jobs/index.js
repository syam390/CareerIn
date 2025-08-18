import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Jobs(){
  const [jobs, setJobs] = useState([])
  const load = async ()=>{
    const { data } = await supabase.from('jobs').select('*').eq('is_active',true).order('created_at',{ascending:false})
    setJobs(data ?? [])
  }
  useEffect(()=>{ load() },[])
  return (
    <div>
      <div className="card">
        <Link href="/jobs/new"><a className="btn">Post a Job</a></Link>
      </div>
      <div className="card">
        <h3>Open Jobs</h3>
        {jobs.map(j=> (
          <div key={j.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <div><strong>{j.title}</strong><div>{j.company} • {j.location}</div></div>
              <div><Link href={`/jobs/${j.id}`}><a className="btn secondary">View</a></Link></div>
            </div>
          </div>
        ))}
        {jobs.length===0 && <p className="small">No jobs yet.</p>}
      </div>
    </div>
  )
}

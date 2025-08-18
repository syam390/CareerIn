import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function NewJob(){
  const [form, setForm] = useState({ title:'', company:'', location:'', description:'', employment_type:'Full-time' })
  const [status, setStatus] = useState(null)
  const router = useRouter()

  const submit = async (e)=>{
    e.preventDefault()
    const u = await supabase.auth.getUser(); if (!u.data.user) { alert('Login first'); return }
    const payload = { ...form, employer_id: u.data.user.id }
    const { error } = await supabase.from('jobs').insert(payload).select()
    if (error) setStatus(error.message)
    else { setStatus('Posted ✅'); router.push('/jobs') }
  }

  return (
    <div className="card">
      <h3>Post a Job</h3>
      <form onSubmit={submit}>
        <label>Title</label>
        <input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <label>Company</label>
        <input className="input" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} required />
        <label>Location</label>
        <input className="input" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
        <label>Employment Type</label>
        <select className="input" value={form.employment_type} onChange={e=>setForm({...form, employment_type:e.target.value})}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
        <label>Description</label>
        <textarea className="input" rows={6} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <button className="btn" type="submit">Post Job</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  )
}

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PostComposer({ onPosted }){
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    const { error } = await supabase.from('posts').insert({ content: text }).select()
    setLoading(false)
    if (!error) { setText(''); onPosted?.() }
    else alert(error.message)
  }
  return (
    <div className="card">
      <form onSubmit={submit}>
        <label>Share an update</label>
        <textarea className="input" rows={3} value={text} onChange={e=>setText(e.target.value)} />
        <div style={{display:'flex', marginTop:8}}>
          <button className="btn" type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
        </div>
      </form>
    </div>
  )
}

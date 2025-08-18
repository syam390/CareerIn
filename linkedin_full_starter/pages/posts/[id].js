import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function PostDetail(){
  const router = useRouter(); const { id } = router.query
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  const load = async ()=>{
    if (!id) return
    const { data } = await supabase.from('posts').select('*').eq('id', id).single()
    setPost(data)
    const { data: c } = await supabase.from('comments').select('*').eq('post_id', id).order('created_at',{ascending:true})
    setComments(c ?? [])
  }

  useEffect(()=>{ load() },[id])

  const addComment = async (e)=>{
    e.preventDefault()
    const u = await supabase.auth.getUser(); if (!u.data.user) { alert('Login first'); return }
    const { error } = await supabase.from('comments').insert({ post_id: id, content: text }).select()
    if (!error) { setText(''); load() } else alert(error.message)
  }

  if (!post) return <div className="card">Loading...</div>

  return (
    <div>
      <div className="card">
        <h3>{post.content}</h3>
        <small>{new Date(post.created_at).toLocaleString()}</small>
      </div>
      <div className="card">
        <h4>Comments</h4>
        {comments.map(c=> <div key={c.id} className="card"><div>{c.content}</div><small>{new Date(c.created_at).toLocaleString()}</small></div>)}
        <form onSubmit={addComment}>
          <label>Add comment</label>
          <input className="input" value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn" type="submit">Comment</button>
        </form>
      </div>
    </div>
  )
}

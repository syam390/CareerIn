import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import PostComposer from '../components/PostComposer'
import Post from '../components/Post'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const load = async ()=>{
    const { data } = await supabase.from('posts').select('*').order('created_at',{ascending:false}).limit(50)
    setPosts(data ?? [])
  }
  useEffect(()=>{ load() },[])
  return (
    <div>
      <PostComposer onPosted={load} />
      <div className="card">
        <h3>Recent Posts</h3>
        {posts.map(p=> <Post key={p.id} post={p} onAction={load} />)}
        {posts.length===0 && <p className="small">No posts yet.</p>}
      </div>
    </div>
  )
}

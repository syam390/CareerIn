import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Post({ post, onAction }){
  const [profile, setProfile] = useState(null)
  const [likesCount, setLikesCount] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(()=>{
    (async ()=>{
      const { data } = await supabase.from('profiles').select('full_name,username').eq('id', post.user_id).single()
      setProfile(data)
      const { data: l } = await supabase.from('likes').select('*').eq('post_id', post.id)
      setLikesCount(l?.length ?? 0)
      const u = await supabase.auth.getUser(); if (u.data.user) {
        const { data: me } = await supabase.from('likes').select('*').eq('post_id', post.id).eq('user_id', u.data.user.id)
        setLiked((me?.length ?? 0) > 0)
      }
    })()
  },[post.id])

  const toggleLike = async ()=>{
    const u = await supabase.auth.getUser(); if (!u.data.user) { alert('Login first'); return }
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', u.data.user.id)
      setLikesCount(c=>c-1); setLiked(false); onAction?.()
    } else {
      await supabase.from('likes').insert({ post_id: post.id }).select()
      setLikesCount(c=>c+1); setLiked(true); onAction?.()
    }
  }

  return (
    <div className="post">
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div>
          <strong>{profile?.full_name ?? 'Someone'}</strong> <small>@{profile?.username}</small>
        </div>
        <div><small>{new Date(post.created_at).toLocaleString()}</small></div>
      </div>
      <div style={{marginTop:6, marginBottom:6}}>{post.content}</div>
      <div className="flex">
        <button className="btn secondary" onClick={toggleLike}>{liked ? 'Unlike' : 'Like'} ({likesCount})</button>
        <a href={`/posts/${post.id}`}>Comments</a>
      </div>
    </div>
  )
}

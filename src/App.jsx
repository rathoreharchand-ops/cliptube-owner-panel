import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient("https://vdfolmjeqfaegfwitjtr.supabase.co","sb_publishable_EGYYZoskx3V-PbWr3Sb1kw_PH-BRuM8")
const OWNER_EMAIL = "rathoreharchand@gmail.com"

export default function App(){
  const [email,setEmail]=useState(""); const [pass,setPass]=useState(""); const [user,setUser]=useState(null)
  const [config,setConfig]=useState({features:{}, announcement:"", app_title:"ClipTube", maintenance_mode:false})
  const [videos,setVideos]=useState([]); const [chat,setChat]=useState([{role:"ai",text:"नमस्ते मालिक! 🙏 बोलो क्या जोड़ना है? Like, Share, Comment, Dislike, Live, Messenger, Video Call?"}]); const [msg,setMsg]=useState(""); const [typing,setTyping]=useState(false)

  useEffect(()=>{ fetchData() },[])
  const fetchData=async()=>{
    const {data:cfg}=await supabase.from('app_config').select('*').eq('id',1).single()
    if(cfg) setConfig(cfg)
    const {data:vids}=await supabase.from('videos').select('*').order('created_at',{ascending:false})
    if(vids) setVideos(vids)
  }

  const login=async()=>{
    const {data,error}=await supabase.auth.signInWithPassword({email,password:pass})
    if(error) return alert(error.message)
    if(data.user.email!==OWNER_EMAIL) { alert("Access Denied - Only Owner!"); await supabase.auth.signOut(); return }
    setUser(data.user)
  }

  const updateConfig=async(newFeatures, extra={})=>{
    const newCfg={...config, features:{...config.features,...newFeatures},...extra}
    await supabase.from('app_config').update(newCfg).eq('id',1)
    setConfig(newCfg)
  }

  const handleAI=async()=>{
    if(!msg.trim()) return
    const userMsg=msg; setChat(c=>[...c,{role:"user",text:userMsg}]); setMsg(""); setTyping(true)
    const low=userMsg.toLowerCase()
    let added=[]; let feats={}
    if(low.includes("like")) {feats.like=true; added.push("Like ♥️")}
    if(low.includes("dislike")) {feats.dislike=true; added.push("Dislike 👎")}
    if(low.includes("share")) {feats.share=true; added.push("Share")}
    if(low.includes("comment")) {feats.comment=true; added.push("Comment 💬")}
    if(low.includes("live")) {feats.live=true; added.push("Live 🔴")}
    if(low.includes("messenger")||low.includes("message")) {feats.messenger=true; added.push("Messenger")}
    if(low.includes("video call")||low.includes("videocall")||low.includes("call")) {feats.videocall=true; added.push("Video Call 📹")}
    if(low.includes("हटा")||low.includes("hatao")||low.includes("remove")){
      Object.keys(feats).forEach(k=>feats[k]=false)
    }

    setTimeout(async()=>{
      if(Object.keys(feats).length>0){
        await updateConfig(feats)
        const act=low.includes("हटा")?"हटा दिया":"जोड़ दिया"
        setChat(c=>[...c,{role:"ai",text:`Done भाई! ✅ ${added.join(", ")} ${act}! \n\nअब User App में सबके फोन में POPUP आएगा:\n🔔 नया अपडेट आया है - Refresh करो\n\nRefresh करते ही बटन असली में काम करेगा!`}])
      } else {
        setChat(c=>[...c,{role:"ai",text:"समझा नहीं भाई! बोलो - 'Like Share Comment Dislike जोड़ दो'"}])
      }
      setTyping(false)
    },800)
  }

  const deleteVideo=async(id,url)=>{
    if(!confirm("Delete करना है?")) return
    const name=url.split('/').pop()
    await supabase.storage.from('videos').remove([name])
    await supabase.from('videos').delete().eq('id',id)
    fetchData()
  }

  if(!user) return (
    <div style={{background:"#0f0f0f",color:"white",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial"}}>
      <div style={{background:"#212121",padding:"25px",borderRadius:"12px",width:"90%",maxWidth:"380px"}}>
        <h2 style={{color:"#FF0000",textAlign:"center"}}>Owner Panel 🔐</h2>
        <input placeholder="Owner Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"94%",padding:"12px",margin:"8px 0",borderRadius:"6px",border:"none"}}/>
        <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} style={{width:"94%",padding:"12px",margin:"8px 0",borderRadius:"6px",border:"none"}}/>
        <button onClick={login} style={{width:"100%",padding:"12px",background:"#FF0000",color:"white",border:"none",borderRadius:"6px",marginTop:"10px",fontSize:"16px"}}>Owner Login</button>
      </div>
    </div>
  )

  return (
    <div style={{background:"#0f0f0f",color:"white",minHeight:"100vh",fontFamily:"Arial",padding:"10px"}}>
      <h2 style={{color:"#FF0000"}}>ClipTube Owner AI Controller 🟢 LIVE</h2>
      <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:"10px"}}>
        <div style={{background:"#212121",borderRadius:"10px",padding:"10px",height:"80vh",display:"flex",flexDirection:"column"}}>
          <h3>AI Chat</h3>
          <div style={{flex:1,overflowY:"auto",background:"#0f0f0f",borderRadius:"8px",padding:"10px",marginBottom:"10px"}}>
            {chat.map((c,i)=><div key={i} style={{margin:"8px 0",textAlign:c.role==="user"?"right":"left"}}><span style={{background:c.role==="user"?"#FF0000":"#3e3e3e",padding:"8px 12px",borderRadius:"15px",display:"inline-block",maxWidth:"80%",whiteSpace:"pre-wrap"}}>{c.text}</span></div>)}
            {typing&&<div style={{color:"#aaa"}}>AI लिख रहा है...</div>}
          </div>
          <div style={{display:"flex",gap:"5px"}}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAI()} placeholder="जैसे: like share comment dislike जोड़ दो" style={{flex:1,padding:"12px",borderRadius:"20px",border:"none"}}/>
            <button onClick={handleAI} style={{background:"#FF0000",color:"white",border:"none",borderRadius:"20px",padding:"0 20px"}}>भेजो</button>
          </div>
        </div>
        <div style={{background:"#212121",borderRadius:"10px",padding:"10px",height:"80vh",overflowY:"auto"}}>
          <h4>Feature Control</h4>
          {Object.entries({like:"Like ♥️",dislike:"Dislike 👎",share:"Share",comment:"Comment",live:"Live 🔴",messenger:"Messenger",videocall:"Video Call"}).map(([k,label])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",background:"#0f0f0f",padding:"8px",borderRadius:"6px",margin:"5px 0"}}>
              <span>{label}</span><input type="checkbox" checked={!!config.features?.[k]} onChange={e=>updateConfig({[k]:e.target.checked})}/>
            </div>
          ))}
          <h4 style={{marginTop:"15px"}}>Videos ({videos.length})</h4>
          {videos.map(v=><div key={v.id} style={{background:"#0f0f0f",padding:"6px",borderRadius:"6px",margin:"5px 0",display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"12px",width:"70%",overflow:"hidden"}}>{v.title}</span><button onClick={()=>deleteVideo(v.id,v.video_url)} style={{background:"#FF0000",color:"white",border:"none",padding:"4px 8px",borderRadius:"4px"}}>Delete</button></div>)}
        </div>
      </div>
    </div>
  )
                                                                                                      }

import { useState, useEffect, useRef } from 'react'

function App() {
  const [logged, setLogged] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'नमस्ते मालिक! 🙏 मैं तुम्हारा ClipTube का Personal AI हूँ।\n\nबोलो क्या करना है?\n\nतुम बोलो - "एक LIVE बटन जोड़ दे" या "Messenger जोड़ दे" - मैं 2 मिनट में सबके App में जोड़ दूंगा!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [features, setFeatures] = useState({
    like: true, dislike: true, share: true, comment: true, live: false, messenger: false, videoCall: false, download: false
  })
  const chatRef = useRef(null)

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const handleLogin = () => {
    if (email === 'owner@cliptube.com' && pass === 'owner123') {
      setLogged(true)
    } else {
      alert('Email: owner@cliptube.com\nPassword: owner123')
    }
  }

  const sendToAgent = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(m => [...m, { from: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: userMsg, features })
      })
      const data = await res.json()

      if (data.success) {
        // Features update करो
        if (data.updatedFeatures) {
          setFeatures(data.updatedFeatures)
        }
        setMessages(m => [...m, { from: 'ai', text: data.message || 'हो गया मालिक! ✅' }])
      } else {
        setMessages(m => [...m, { from: 'ai', text: 'Error: ' + (data.error || 'कुछ गड़बड़ हुई!') }])
      }
    } catch (e) {
      setMessages(m => [...m, { from: 'ai', text: 'Network Error भाई! Vercel का Logs check करो - ' + e.message }])
    }
    setLoading(false)
  }

  if (!logged) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111', color: 'white' }}>
        <div style={{ background: '#222', padding: 30, borderRadius: 15, width: 320 }}>
          <h2>ClipTube Owner Login</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, margin: '10px 0', borderRadius: 8 }} />
          <input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: 10, margin: '10px 0', borderRadius: 8 }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: 12, background: '#ff0050', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>Login</button>
          <p style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>owner@cliptube.com / owner123</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f0f0f', color: 'white' }}>
      <div style={{ padding: '15px', background: '#1a1a1a', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
        <h3>🤖 ClipTube AI Owner Panel</h3>
        <button onClick={() => setLogged(false)} style={{ background: '#333', color: 'white', border: 'none', padding: '5px 12px', borderRadius: 6 }}>Logout</button>
      </div>

      <div style={{ padding: 10, display: 'flex', gap: 8, flexWrap: 'wrap', background: '#1a1a1a' }}>
        {Object.entries(features).map(([k, v]) => (
          <span key={k} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: v? '#00c853' : '#444', color: 'white' }}>
            {k}: {v? 'ON' : 'OFF'}
          </span>
        ))}
      </div>

      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === 'user'? 'flex-end' : 'flex-start', background: m.from === 'user'? '#ff0050' : '#2a2a2a', padding: '10px 14px', borderRadius: 12, maxWidth: '80%', whiteSpace: 'pre-wrap' }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ background: '#2a2a2a', padding: '10px 14px', borderRadius: 12, maxWidth: '80%', opacity: 0.7 }}>Agent काम कर रहा है... ⏳</div>}
      </div>

      <div style={{ padding: 10, display: 'flex', gap: 8, background: '#1a1a1a', borderTop: '1px solid #333' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendToAgent()} placeholder="बोलो - एक LIVE बटन जोड़ दे..." style={{ flex: 1, padding: 12, borderRadius: 25, border: 'none', background: '#2a2a2a', color: 'white' }} />
        <button onClick={sendToAgent} disabled={loading} style={{ padding: '0 20px', borderRadius: 25, background: '#ff0050', color: 'white', border: 'none', fontWeight: 'bold' }}>{loading? '...' : 'Send'}</button>
      </div>
    </div>
  )
}

export default App
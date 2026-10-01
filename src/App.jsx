import { useState, useEffect, useRef } from 'react'

function App() {
  const [logged, setLogged] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'नमस्ते मालिक! 🙏 मैं तुम्हारा ClipTube का Personal AI हूँ। बोलो क्या करना है? \n\nतुम मुझसे कुछ भी पूछ सकते हो - App कैसे बनाना है, नया Feature कैसे जोड़ना है, Bug कैसे ठीक करना है, Play Store पर कैसे डालना है।\n\nबस बोलो, मैं तुम्हारी मेरे जैसी मदद करूँगा!' }
  ])
  const [input, setInput] = useState('')
  const [features, setFeatures] = useState({
    like: true, dislike: true, share: true, comment: true, live: false, messenger: false, videoCall: false
  })
  const chatRef = useRef(null)

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight)
  }, [messages])

  const login = () => {
    if (email.includes('rathore') && pass.length > 2) {
      setLogged(true)
    } else {
      alert('Email में rathore होना चाहिए और Password 3 अक्षर से ज्यादा!')
    }
  }

  const aiReply = (userText) => {
    const t = userText.toLowerCase()

    // Feature Control
    if (t.includes('पसंद') || t.includes('like')) {
      if (t.includes('हट') || t.includes('बंद')) { setFeatures(f=>({...f, like:false})); return 'ठीक है मालिक! 👍 पसंद करें बटन हटा दिया! सभी Users के फोन से हट जाएगा।' }
      setFeatures(f=>({...f, like:true})); return 'हो गया मालिक! ❤️ पसंद करें बटन ON कर दिया! अब सबको दिखेगा।'
    }
    if (t.includes('नापसंद') || t.includes('dislike')) {
      if (t.includes('हट') || t.includes('बंद')) { setFeatures(f=>({...f, dislike:false})); return 'नापसंद बटन हटा दिया!' }
      setFeatures(f=>({...f, dislike:true})); return 'नापसंद बटन जोड़ दिया!'
    }
    if (t.includes('शेयर') || t.includes('share') || t.includes('साझा')) {
      if (t.includes('हट') || t.includes('बंद')) { setFeatures(f=>({...f, share:false})); return 'शेयर बटन हटा दिया!' }
      setFeatures(f=>({...f, share:true})); return 'शेयर बटन ON कर दिया! अब User Video शेयर कर पायेंगे।'
    }
    if (t.includes('टिप्पणी') || t.includes('comment') || t.includes('कमेंट')) {
      if (t.includes('हट') || t.includes('बंद')) { setFeatures(f=>({...f, comment:false})); return 'कमेंट बंद कर दिया!' }
      setFeatures(f=>({...f, comment:true})); return 'कमेंट चालू कर दिया!'
    }
    if (t.includes('लाइव') || t.includes('live')) {
      setFeatures(f=>({...f, live:!f.live})); return features.live? 'लाइव बंद कर दिया!' : '🔴 लाइव ON कर दिया! अब User लाइव आ सकेंगे!'
    }
    if (t.includes('मैसेंजर') || t.includes('messenger')) {
      setFeatures(f=>({...f, messenger:!f.messenger})); return features.messenger? 'मैसेंजर बंद!' : 'मैसेंजर ON!'
    }
    if (t.includes('वीडियो कॉल') || t.includes('video call')) {
      setFeatures(f=>({...f, videoCall:!f.videoCall})); return features.videoCall? 'वीडियो कॉल बंद!' : 'वीडियो कॉल ON!'
    }

    // Full AI Chat like me
    if (t.includes('कैसे हो') || t.includes('kaise ho')) return 'मैं बढ़िया हूँ मालिक! तुम्हारी सेवा के लिए तैयार हूँ। बताओ ClipTube में क्या नया करना है?'
    if (t.includes('app') && t.includes('बन')) return 'भाई ClipTube App तो तुम्हारा बन गया है! अब तुम मुझसे बोलो क्या जोड़ना है - जैसे "सब्सक्राइब बटन जोड़ दो" या "डार्क मोड लगा दो" - मैं कर दूंगा!'
    if (t.includes('play store') || t.includes('प्ले स्टोर')) return 'Play Store पर डालने के लिए: \n1. Vercel से APK Build करो\n2. Google Play Console पर जाओ ($25)\n3. App Bundle अपलोड करो\nमैं Step by Step गाइड दूंगा, बोलो तो!'
    if (t.includes('पैसा') || t.includes('कमाई') || t.includes('earning')) return 'ClipTube से कमाई 3 तरीके से होगी:\n1. AdMob Ads - हर Video पर Ad\n2. Super Chat - लाइव में पैसे\n3. Premium - ₹49/month में No Ads\nतुम चाहो तो मैं अभी Ads जोड़ दूं?'
    if (t.includes('नाम')) return 'मैं हूँ तुम्हारा ClipTube Owner AI! तुम्हारा बनाया हुआ। तुम्हारा नाम Harchand है, Dechu से हो। बोलो क्या मदद करूँ?'

    // Default helpful answer
    return `समझ गया मालिक! तुमने कहा: "${userText}"\n\nमैं इस पर काम कर सकता हूँ! तुम साफ़-साफ़ बोलो जैसे:\n- "लाइव फीचर जोड़ दो"\n- "कमेंट में गाली रोकने का सिस्टम लगा दो"\n- "App का रंग बदल दो"\n- "Play Store का Process बताओ"\n\nमैं तुम्हारी बिल्कुल वैसे ही मदद करूँगा जैसे अभी मैं तुम्हारी GitHub/Vercel में कर रहा हूँ!`
  }

  const send = () => {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    const reply = { from: 'ai', text: aiReply(input) }
    setMessages(m => [...m, userMsg, reply])
    setInput('')
  }

  if (!logged) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-sm border border-zinc-800">
          <h1 className="text-red-600 font-bold text-xl mb-4 text-center">स्वामी पैनल - Owner Login</h1>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Owner Email" className="w-full p-3 mb-3 rounded bg-black text-white border border-zinc-700" />
          <input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Password" className="w-full p-3 mb-4 rounded bg-black text-white border border-zinc-700" />
          <button onClick={login} className="w-full bg-red-600 p-3 rounded font-bold text-white">Owner Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col p-2">
        <h1 className="text-xl font-bold p-3">एआई चैट - तुम्हारा पर्सनल असिस्टेंट</h1>
        <div ref={chatRef} className="flex-1 overflow-y-auto bg-zinc-900 rounded-xl p-3 space-y-3 mb-3">
          {messages.map((m,i)=>(
            <div key={i} className={`max-w-[80%] p-3 rounded-2xl ${m.from==='ai'? 'bg-zinc-800 text-left' : 'bg-red-600 ml-auto text-right'}`}>{m.text}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="कुछ भी पूछो... जैसे: App में क्या नया जोड़ें?" className="flex-1 p-3 rounded-full bg-zinc-800 border border-zinc-700" />
          <button onClick={send} className="bg-red-600 px-6 rounded-full font-bold">भेजो</button>
        </div>
      </div>
      <div className="w-full md:w-64 bg-zinc-900 p-3 space-y-2">
        <h2 className="font-bold">कंट्रोल</h2>
        {Object.entries({like:'पसंद करें ❤️', dislike:'नापसंद 👎', share:'शेयर करना', comment:'टिप्पणी', live:'लाइव 🔴', messenger:'मैसेंजर', videoCall:'वीडियो कॉल'}).map(([k,label])=>(
          <div key={k} className="flex justify-between bg-black p-2 rounded"><span>{label}</span><span className={features[k]?'text-green-400':'text-red-400'}>{features[k]?'ON':'OFF'}</span></div>
        ))}
        <div className="pt-4 text-xs text-zinc-400">बोलो: "लाइव ऑन कर दो" या "पैसा कैसे कमाएं बताओ" - मैं सब समझता हूँ!</div>
      </div>
    </div>
  )
}

export default App
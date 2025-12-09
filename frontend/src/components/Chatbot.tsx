import React, { useEffect, useRef, useState } from 'react'
import styles from './Chatbot.module.css'
import iconLight from '../assets/chatbot-icon.svg'
import iconDark from '../assets/chatbot-icon-dark.svg'

type Message = { from: 'user' | 'bot'; text: string; time?: string }

const initialBotGreeting = `Hello! I'm DBT Connect assistant. How can I help you today?`;

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: initialBotGreeting }])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'en'|'hi'>('en')
  const [isDark, setIsDark] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setIsDark(document.documentElement.classList.contains('dark') || (mq && mq.matches))
    update()
    mq && mq.addEventListener('change', update)
    return () => mq && mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    // scroll to bottom on new message
    listRef.current && (listRef.current.scrollTop = listRef.current.scrollHeight)
  }, [messages, open])

  function postUser(text: string) {
    if (!text.trim()) return
    const msg: Message = { from: 'user', text: text.trim(), time: new Date().toLocaleTimeString() }
    setMessages((m) => [...m, msg])
    setValue('')
    // call backend OpenAI proxy
    const API_URL = (import.meta as any)?.env?.VITE_CHAT_API_URL || 'http://localhost:4000/api/chat'
    setLoading(true)
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text.trim(), lang })
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        const data = await res.json()
        const reply = data?.reply || produceReply(text.trim(), lang)
        setMessages((m) => [...m, { from: 'bot', text: reply, time: new Date().toLocaleTimeString() }])
      })
      .catch((err) => {
        console.error('Chat API error:', err)
        // fallback to local rule-based reply
        const reply = produceReply(text.trim(), lang)
        setMessages((m) => [...m, { from: 'bot', text: reply, time: new Date().toLocaleTimeString() }])
      })
      .finally(() => setLoading(false))
  } 

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      postUser(value)                     
    }
  }

  return (
    <div className={styles.wrapper} aria-live="polite">
      <div className={styles.container} data-open={open}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar} aria-hidden>
              <img src={isDark ? iconDark : iconLight} alt="DBT Connect assistant" />
            </div>
            <div>
              <div className={styles.title}>DBT Connect Assistant</div>
              <div className={styles.subtitle}>{lang === 'en' ? 'Ask about DBT schemes, login, uploads...' : 'DBT sambandhi sawaal — हिंदी/हिंग्लिश मदद'}</div>
            </div>
          </div>
          <div className={styles.headerRight}>
            <label className={styles.langToggle}>
              <select value={lang} onChange={(e) => setLang(e.target.value as 'en'|'hi')} aria-label="Choose language">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="hi">हिंदी</option>
                <option value="hi">हिंदी</option>
                <option value="hi">हिंदी</option>
              </select>
            </label>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>
        </div>

        <div className={styles.messages} ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={m.from === 'user' ? styles.msgRowUser : styles.msgRowBot}>
              <div className={m.from === 'user' ? styles.msgUser : styles.msgBot}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            aria-label={lang === 'en' ? 'Type a message' : 'संदेश लिखें'}
            placeholder={lang === 'en' ? 'Type your question (e.g. upload issue, login)...' : 'अपना प्रश्न लिखें — उदाहरण: अपलोड समस्या, लॉगिन'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            className={styles.input}
          />
          <button className={styles.sendBtn} onClick={() => postUser(value)} aria-label="Send message">→</button>
        </div>
      </div>

      <button
        className={styles.fab}
        onClick={() => setOpen((s) => !s)}
        aria-pressed={open ? 'true' : 'false'}
        aria-label={open ? 'Hide chat' : 'Open chat'}
      >
        <img src={isDark ? iconDark : iconLight} alt="Chat" />
      </button>
    </div>
  )
}

function produceReply(userText: string, lang: 'en'|'hi') {
  const t = userText.toLowerCase()
  // basic rule-based replies for common topics
  if (/upload|media|image|photo|video/.test(t)) {
    return lang === 'en'
      ? 'If you face upload issues, please ensure file size and format match the guidelines (JPG/PNG/PDF, max 10MB). Try a different browser or clear cache. Still failing? Use the “Report an issue” option in the dashboard.'
      : 'यदि आप अपलोड में समस्या का सामना कर रहे हैं, तो कृपया फ़ाइल का आकार और फ़ॉर्मेट (JPG/PNG/PDF, अधिकतम 10MB) जाँचें। ब्राउज़र बदलकर या कैश साफ़ करके पुनः प्रयास करें। समस्या बनी रहे तो रिपोर्ट करें।'
  }
  if (/login|password|signin|sign in/.test(t)) {
    return lang === 'en'
      ? 'For login issues, confirm your username and mobile/email. Use “Forgot password” to reset. If MFA is enabled, keep your registered device handy.'
      : 'लॉगिन समस्या के लिए उपयोगकर्ता नाम और मोबाइल/ईमेल जांचें। पासवर्ड भूलने पर “Forgot password” का उपयोग करें। यदि MFA सक्षम है तो अपना पंजीकृत डिवाइस रखें।'
  }
  if (/role|admin|ngo|panchayat|pta|profile/.test(t)) {
    return lang === 'en'
      ? 'Roles are managed from the Admin / Profile section. Contact your local administrator to request role changes or verify required documents.'
      : 'रोल्स व्यवस्थापक/प्रोफ़ाइल सेक्शन से संचालित होते हैं। रोल परिवर्तन हेतु अपने स्थानीय व्यवस्थापक से संपर्क करें।'
  }
  if (/report|dashboard|status/.test(t)) {
    return lang === 'en'
      ? 'Dashboard reports update nightly. Use filters to narrow results. Export options are available in CSV and PDF formats.'
      : 'डैशबोर्ड रिपोर्ट हर रात अपडेट होती हैं। फ़िल्टर का उपयोग करें और CSV/PDF में निर्यात विकल्प देखें।'
  }
  // default
  return lang === 'en'
    ? 'I can help with DBT schemes, uploads, roles, login, and reports. Could you please provide a few more details?' 
    : 'मैं DBT योजनाओं, अपलोड, रोल, लॉगिन और रिपोर्ट्स में मदद कर सकता/सकती हूं। कृपया थोड़ी और जानकारी दें।'
}

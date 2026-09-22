import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sun, Heart, BookOpen, ArrowUpRight, Leaf, ShieldCheck, Sparkles, Trash2, Check, Wind } from 'lucide-react';
import './style.css';

type Entry = { id: string; mood: number; note: string; date: string };
const moods = ['很低落', '不太好', '一般', '还不错', '很开心'];
function loadEntries(): { entries: Entry[]; error: string } {
  try {
    const data = JSON.parse(localStorage.getItem('mood-space-entries') || '[]');
    if (!Array.isArray(data) || !data.every(e => typeof e.id === 'string' && Number.isInteger(e.mood) && e.mood >= 1 && e.mood <= 5 && typeof e.note === 'string' && !isNaN(Date.parse(e.date)))) throw new Error();
    return { entries: data, error: '' };
  } catch { return { entries: [], error: '暂时无法读取本地记录。你仍可以体验页面，保存时会再次尝试。' }; }
}
function Face({ mood }: { mood: number }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill={['#dfdde9', '#e4e5ed', '#f0e5c9', '#e0e9d4', '#d3e3c5'][mood - 1]}/><circle cx="17" cy="20" r="1.6" fill="currentColor"/><circle cx="31" cy="20" r="1.6" fill="currentColor"/><path d={mood < 3 ? 'M17 32 Q24 24 31 32' : mood === 3 ? 'M18 29 H30' : 'M16 27 Q24 37 32 27'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function App() {
  const [initial] = useState(loadEntries);
  const [entries, setEntries] = useState(initial.entries);
  const [page, setPage] = useState('今日心情');
  const [mood, setMood] = useState(0);
  const [note, setNote] = useState('');
  const [message, setMessage] = useState(initial.error);
  const [breathing, setBreathing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  React.useEffect(() => {
    if (!breathing) return;
    const started = performance.now() - seconds * 1000;
    const timer = window.setInterval(() => {
      const elapsed = Math.min(60, Math.floor((performance.now() - started) / 1000));
      setSeconds(elapsed);
      if (elapsed >= 60) { setBreathing(false); setMessage('已完成一分钟练习。留意一下此刻的感受吧。'); }
    }, 100);
    return () => clearInterval(timer);
  }, [breathing]);
  React.useEffect(() => { setBreathing(false); }, [page]);
  function persist(next: Entry[]) {
    try { localStorage.setItem('mood-space-entries', JSON.stringify(next)); setEntries(next); return true; }
    catch { setMessage('保存失败：浏览器存储可能已满或被禁用，请检查浏览器设置后再试。'); return false; }
  }
  function save() {
    if (!mood) return;
    if (persist([{ id: crypto.randomUUID(), mood, note: note.trim(), date: new Date().toISOString() }, ...entries])) { setMessage('已保存。谢谢你，愿意为自己的感受停留片刻。'); setMood(0); setNote(''); }
  }
  const nav = [{ name: '今日心情', icon: Sun }, { name: '情绪回顾', icon: BookOpen }, { name: '关怀空间', icon: Heart }];
  const average = entries.length ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1) : '—';
  const phase = seconds % 10 < 4 ? '轻轻吸气' : '慢慢呼气';
  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="/" aria-label="心晴首页"><span className="brand-icon"><Sun size={25}/></span><span>心晴<small>MOOD SPACE</small></span></a><div className="side-label">留一点时间，给自己</div><nav>{nav.map(({name, icon: Icon}) => <button className={page === name ? 'nav-item active' : 'nav-item'} key={name} onClick={() => setPage(name)}><Icon size={19}/><span>{name}</span>{page === name && <span className="nav-dot"/>}</button>)}</nav><div className="side-bottom"><div className="little-leaf"><Leaf size={25}/></div><p>不必每一天都晴朗，<br/>阴天也有它的意义。</p><span>你的情绪，值得被看见</span></div><div className="version">心晴 · 初始体验版</div></aside>
    <main><header><div className="breadcrumb">我的小空间 <span>/</span> <strong>{page}</strong></div><span className="privacy"><ShieldCheck size={15}/> 只属于你的记录</span></header>
      <div className="content"><div className="page-heading"><div><span className="eyebrow">A LITTLE SPACE FOR YOURSELF</span><h1>{page === '今日心情' ? '记录此刻，慢慢晴朗。' : page === '情绪回顾' ? '看见情绪，也看见自己。' : '给自己，一点温柔的时间。'}</h1><p>{page === '今日心情' ? '无论今天是什么天气，这里都留着你的位置。' : page === '情绪回顾' ? '每一次记录，都是靠近自己的一小步。' : '从一次呼吸开始，不急着改变什么。'}</p></div><span className="date">{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}</span></div>
      {message && <div className="notice" role="status"><Check size={17}/><span>{message}</span><button onClick={() => setMessage('')} aria-label="关闭提示">×</button></div>}
      {page === '今日心情' && <><section className="hero"><div><span className="hero-label"><span/> 在这里，做真实的自己</span><h2>心情有起伏，<br/>生活有回响。</h2><p>不用组织好语言，也不用总是积极。<br/>花一点时间，听听此刻的自己。</p><span className="hero-foot">一份记录 · 一点觉察 · 一次小小的关怀</span></div><div className="landscape" aria-hidden="true"><div className="sun"/><div className="cloud cloud-one"/><div className="cloud cloud-two"/><div className="hill hill-back"/><div className="hill hill-front"/><div className="hill hill-light"/><svg className="sprout" viewBox="0 0 100 150"><path d="M51 147Q53 75 44 29" fill="none" stroke="#496b54" strokeWidth="3"/><path d="M49 85Q-1 83 13 41Q52 44 49 85M48 63Q91 55 87 19Q47 21 48 63" fill="#668871"/></svg><div className="art-note">let yourself bloom.</div></div></section>
      <div className="home-grid"><section className="card checkin"><div className="section-title"><h2>此刻，你的心情怎么样？</h2><span>30 秒，和自己聊一聊</span></div><div className="moods" role="group" aria-label="选择心情评分">{moods.map((label, i) => <button key={label} className={mood === i + 1 ? 'mood selected' : 'mood'} aria-pressed={mood === i + 1} onClick={() => setMood(i + 1)}><Face mood={i + 1}/><span>{label}</span><small>{i + 1} 分</small></button>)}</div><label className="note-label" htmlFor="note">给此刻留一句话 <span>选填</span></label><div className="textarea-wrap"><textarea id="note" value={note} onChange={e => setNote(e.target.value)} maxLength={500} placeholder="发生了什么？写一句也可以。"/><span>{note.length}/500</span></div><div className="save-row"><span><ShieldCheck size={14}/> 仅保存在当前浏览器</span><button className="primary" disabled={!mood} onClick={save}>保存此刻 <ArrowUpRight size={17}/></button></div></section><aside className="gentle-card"><span className="small-icon"><Sparkles size={20}/></span><span className="eyebrow">TODAY'S LITTLE REMINDER</span><h2>你不需要一直<br/>做得很好。</h2><p>允许自己慢一点。<br/>有时候，照顾好当下的感受，<br/>就是今天很重要的一件事。</p><div className="card-divider"/><button className="text-button" onClick={() => setPage('关怀空间')}>给自己一分钟 <ArrowUpRight size={17}/></button></aside></div></>}
      {page === '情绪回顾' && <div className="stats"><div className="card"><span>心情记录</span><strong>{entries.length}<small>条</small></strong></div><div className="card"><span>记录天数</span><strong>{new Set(entries.map(e => new Date(e.date).toLocaleDateString())).size}<small>天</small></strong></div><div className="card"><span>平均心情</span><strong>{average}<small>/ 5 分</small></strong></div></div>}
      {page !== '关怀空间' && <section className="records-section"><div className="section-title"><h2>{page === '今日心情' ? '最近的心情' : '你的日记时间线'}</h2>{page === '今日心情' && <button className="text-button" onClick={() => setPage('情绪回顾')}>查看全部 <ArrowUpRight size={15}/></button>}</div>{!entries.length ? <div className="empty card"><BookOpen size={28}/><h3>故事，从此刻开始</h3><p>第一条记录不用很特别。今天的心情，就很好。</p>{page !== '今日心情' && <button className="primary" onClick={() => setPage('今日心情')}>记录第一次心情</button>}</div> : <div className="record-list">{(page === '今日心情' ? entries.slice(0, 3) : entries).map(entry => <article className="record card" key={entry.id}><div className="record-face"><Face mood={entry.mood}/></div><div className="record-body"><div><strong>{moods[entry.mood - 1]} <small>· {entry.mood} 分</small></strong><time>{new Date(entry.date).toLocaleString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></div><p>{entry.note || '为此刻的心情，留一个小小的记号。'}</p></div><button className="icon-button" aria-label="删除记录" onClick={() => { if (window.confirm('确定删除这条记录吗？删除后无法恢复。')) { if (persist(entries.filter(e => e.id !== entry.id))) setMessage('这条记录已删除。'); } }}><Trash2 size={16}/></button></article>)}</div>}</section>}
      {page === '关怀空间' && <section className="card breathing-card"><span className="small-icon"><Wind size={23}/></span><h2>一分钟，呼吸放松</h2><p>吸气 4 秒，呼气 6 秒。不需要屏息。</p><div className="breathing-stage"><div className="breathing-ring" style={{ transform: `scale(${breathing ? (seconds % 10 < 4 ? 0.8 + (seconds % 10) * .075 : 1.1 - ((seconds % 10) - 4) * .05) : .9})` }}/><div className="breathing-copy"><strong>{seconds >= 60 ? '练习完成' : breathing ? phase : seconds > 0 ? '已暂停' : '慢下来'}</strong><span>{Math.max(0, 60 - seconds)} 秒</span></div></div><div className="breathing-buttons"><button className="primary" onClick={() => { if (seconds >= 60) setSeconds(0); setBreathing(!breathing); }}>{breathing ? '暂停练习' : seconds >= 60 ? '再练习一次' : seconds > 0 ? '继续练习' : '开始练习'}</button>{seconds > 0 && seconds < 60 && <button className="secondary" onClick={() => { setBreathing(false); setSeconds(0); }}>结束练习</button>}</div><small>请按舒适的节奏进行，如感到不适，可以随时停止。</small></section>}
      <footer><Leaf size={14}/><span>用于日常情绪记录与自我关怀，不提供诊断或治疗。</span><p>日记仅保存在当前浏览器，不会自动同步，清理浏览器数据后可能丢失。</p></footer></div>
    </main><nav className="mobile-nav">{nav.map(({name, icon: Icon}) => <button key={name} className={page === name ? 'active' : ''} onClick={() => setPage(name)}><Icon size={20}/><span>{name}</span></button>)}</nav>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

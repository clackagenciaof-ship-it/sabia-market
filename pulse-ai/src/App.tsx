import { useMemo, useState } from 'react'
import type { Role, Category } from './types'
import { categories, experiences } from './data/seed'
import { getLocal, saveLocal } from './lib/storage'

export default function App() {
  const [role, setRole] = useState<Role>('visitor')
  const [category, setCategory] = useState<Category>('Bombando')
  const [query, setQuery] = useState('Will, onde é hoje?')
  const [ride, setRide] = useState('Só ida')
  const [reaction, setReaction] = useState('')
  const [adminUnlocked, setAdminUnlocked] = useState(false)
  const current = useMemo(() => experiences.find((item) => item.category === category) ?? experiences[0], [category])

  function willSearch() {
    const q = query.toLowerCase()
    if (q.includes('infantil') || q.includes('criança')) setCategory('Ambiente infantil')
    else if (q.includes('música') || q.includes('show')) setCategory('Música ao vivo')
    else setCategory('Bombando')
    setRole('user')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><div className="logo" /><strong>PulseAí</strong></div>
        <nav>
          <button onClick={() => setRole('visitor')}>Início</button>
          <button onClick={() => setRole('user')}>Usuário</button>
          <button onClick={() => setRole('partner')}>Negócios</button>
          <button onClick={() => setRole('driver')}>Motoristas</button>
          <button onClick={() => setRole('admin')}>Admin 🔒</button>
        </nav>
      </header>

      {role === 'visitor' && (
        <section className="hero-grid">
          <div className="hero-copy">
            <h1>Onde a cidade <span>pulsa agora.</span></h1>
            <p>Descubra o que está rolando em tempo real, veja lotação, cardápio, bebidas, combos, promoções e programe sua ida, sua volta ou sua ida + volta.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => setRole('user')}>Explorar hoje</button>
              <button className="secondary" onClick={() => alert('No lançamento: Google Play e App Store.')}>Quero baixar</button>
              <button className="ghost" onClick={willSearch}>Perguntar ao Will</button>
            </div>
            <div className="stat-grid">
              <article><strong>&lt; 4 min</strong><span>para decidir onde ir</span></article>
              <article><strong>5%+</strong><span>cashback por check-in</span></article>
              <article><strong>100%</strong><span>reações coletivas</span></article>
            </div>
          </div>
          <div className="phone-preview">
            <div className="phone-header">PulseAí</div>
            <div className="intro-card"><strong>Onde a cidade</strong><span>pulsa agora.</span><small>Will, onde é hoje?</small></div>
            <div className="filter-grid">{categories.map((cat) => <button key={cat}>{cat}</button>)}</div>
          </div>
        </section>
      )}

      {role === 'user' && (
        <section className="workspace">
          <div className="panel">
            <h2>Usuário final</h2>
            <p>Experiência do cliente: descobrir, decidir, reservar, programar transporte e reagir à vibe.</p>
            <div className="search-row">
              <input value={query} onChange={(e) => setQuery(e.target.value)} />
              <button onClick={() => setQuery('')}>✕</button>
              <button onClick={willSearch}>🔎</button>
            </div>
            <div className="filter-grid">{categories.map((cat) => <button key={cat} className={cat === category ? 'active' : ''} onClick={() => setCategory(cat)}>{cat}</button>)}</div>
          </div>
          <div className="panel app-panel">
            <article className="experience-card" style={{ background: current.imageGradient }}>
              <small>{current.category} • {current.distance}</small>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
            </article>
            <div className="metric-grid">
              <article><span>Lotação</span><strong>{current.crowd}%</strong></article>
              <article><span>Vibe</span><strong>{current.vibe}</strong></article>
              <article><span>Cashback</span><strong>{current.cashback}%</strong></article>
              <article><span>Check-ins</span><strong>{current.checkins}</strong></article>
            </div>
            <h3>Cardápio, combos e bebidas</h3>
            <div className="menu-list">{current.menu.map((item) => <button key={item.id} onClick={() => alert(`${item.name} • ${item.price}\n${item.detail}`)}><span>{item.emoji}</span><div><small>{item.type}</small><strong>{item.name}</strong><em>{item.price}</em></div></button>)}</div>
            <h3>Transporte</h3>
            <div className="filter-grid">{['Só ida','Só volta','Ida + volta'].map((item) => <button key={item} className={ride === item ? 'active' : ''} onClick={() => setRide(item)}>{item}</button>)}</div>
            <button className="primary" onClick={() => alert(`Corrida solicitada: ${ride}`)}>Solicitar corrida</button>
            <h3>Reagir à vibe</h3>
            <div className="reaction-grid">{['Bombando 🔥','Energia Alta ⚡','Ambiente Acolhedor 💜','Segurança Percebida 🛡️','Público Incrível ✨','Atendimento Top 👏'].map((item) => <button key={item} className={reaction === item ? 'active' : ''} onClick={() => setReaction(item)}>{item}</button>)}</div>
            <button className="secondary" onClick={() => alert(reaction ? `Reação enviada: ${reaction}` : 'Escolha uma reação.')}>Enviar reação</button>
          </div>
        </section>
      )}

      {role === 'partner' && <PartnerArea />}
      {role === 'driver' && <DriverArea />}
      {role === 'admin' && <AdminArea unlocked={adminUnlocked} setUnlocked={setAdminUnlocked} />}
    </main>
  )
}

function PartnerArea() {
  const [business, setBusiness] = useState(() => getLocal('pulse:partner', { name: '', category: '', instagram: '', address: '' }))
  return <section className="workspace"><div className="panel"><h2>Negócios e promotores</h2><p>Cadastre estabelecimento, evento, cardápio, bebidas e combos.</p><div className="form-grid"><input placeholder="Nome do negócio" value={business.name} onChange={(e) => setBusiness({ ...business, name: e.target.value })} /><input placeholder="Categoria" value={business.category} onChange={(e) => setBusiness({ ...business, category: e.target.value })} /><input placeholder="Instagram" value={business.instagram} onChange={(e) => setBusiness({ ...business, instagram: e.target.value })} /><input placeholder="Endereço" value={business.address} onChange={(e) => setBusiness({ ...business, address: e.target.value })} /></div><button className="primary" onClick={() => { saveLocal('pulse:partner', business); alert('Negócio salvo no MVP.') }}>Enviar para aprovação</button></div><div className="panel"><h2>Dashboard</h2><div className="metric-grid"><article><span>Views</span><strong>1.245</strong></article><article><span>Check-ins</span><strong>87</strong></article><article><span>Vouchers</span><strong>42</strong></article><article><span>Conversão</span><strong>18%</strong></article></div></div></section>
}

function DriverArea() {
  const [driver, setDriver] = useState(() => getLocal('pulse:driver', { name: '', phone: '', vehicle: 'Carro', plate: '' }))
  return <section className="workspace"><div className="panel"><h2>Cadastro de motorista</h2><p>Motoristas de carro ou moto para corridas de ida, volta ou ida + volta.</p><div className="form-grid"><input placeholder="Nome" value={driver.name} onChange={(e) => setDriver({ ...driver, name: e.target.value })} /><input placeholder="Telefone" value={driver.phone} onChange={(e) => setDriver({ ...driver, phone: e.target.value })} /><select value={driver.vehicle} onChange={(e) => setDriver({ ...driver, vehicle: e.target.value })}><option>Carro</option><option>Moto</option></select><input placeholder="Placa" value={driver.plate} onChange={(e) => setDriver({ ...driver, plate: e.target.value })} /></div><button className="primary" onClick={() => { saveLocal('pulse:driver', driver); alert('Motorista salvo no MVP.') }}>Enviar pré-cadastro</button></div><div className="panel"><h2>Corridas disponíveis</h2><article className="ride-card"><strong>Evento → Centro</strong><span>Só volta • 2,4 km • R$ 18 estimado</span><button>Aceitar corrida</button></article></div></section>
}

function AdminArea({ unlocked, setUnlocked }: { unlocked: boolean, setUnlocked: (value: boolean) => void }) {
  const [password, setPassword] = useState('')
  if (!unlocked) return <section className="workspace"><div className="panel lock-panel"><h2>Admin 🔒</h2><p>Área restrita ao dono da plataforma.</p><input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="secondary" onClick={() => password ? setUnlocked(true) : alert('Digite uma senha para simular.')}>Entrar</button></div></section>
  return <section className="workspace"><div className="panel"><h2>Painel administrativo</h2><div className="metric-grid"><article><span>Usuários</span><strong>226</strong></article><article><span>Negócios</span><strong>18</strong></article><article><span>Motoristas</span><strong>34</strong></article><article><span>Eventos</span><strong>12</strong></article></div></div><div className="panel"><h2>Aprovações</h2><div className="approval-list"><button>✅ Aprovar negócio</button><button>✅ Aprovar motorista</button><button>⚠️ Revisar evento</button></div></div></section>
}

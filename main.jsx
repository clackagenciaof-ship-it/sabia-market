import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Leaf,
  ShoppingBasket,
  Droplets,
  Recycle,
  BarChart3,
  Search,
  PlusCircle,
  Sprout,
  MapPin,
  Clock,
  MessageCircle,
} from 'lucide-react';
import './style.css';

const produtosIniciais = [
  {
    id: 1,
    nome: 'Alface crespa',
    produtor: 'Horta Dona Maria',
    categoria: 'Verduras',
    preco: 3.5,
    unidade: 'maço',
    quantidade: 12,
    local: 'Feira do bairro',
    horario: 'até 10h30',
    ultimaColheita: false,
    imagem: '🥬',
  },
  {
    id: 2,
    nome: 'Tomate regional',
    produtor: 'Sítio Boa Esperança',
    categoria: 'Legumes',
    preco: 6,
    unidade: 'kg',
    quantidade: 18,
    local: 'Retirada na escola',
    horario: 'até 12h',
    ultimaColheita: true,
    imagem: '🍅',
  },
  {
    id: 3,
    nome: 'Banana prata',
    produtor: 'Produtor João',
    categoria: 'Frutas',
    preco: 5,
    unidade: 'dúzia',
    quantidade: 9,
    local: 'Feira livre',
    horario: 'até 11h',
    ultimaColheita: false,
    imagem: '🍌',
  },
  {
    id: 4,
    nome: 'Cheiro-verde',
    produtor: 'Horta Escolar',
    categoria: 'Temperos',
    preco: 2,
    unidade: 'maço',
    quantidade: 20,
    local: 'Horta da escola',
    horario: 'até 15h',
    ultimaColheita: false,
    imagem: '🌿',
  },
  {
    id: 5,
    nome: 'Macaxeira',
    produtor: 'Associação Raízes',
    categoria: 'Raízes',
    preco: 4.5,
    unidade: 'kg',
    quantidade: 15,
    local: 'Ponto comunitário',
    horario: 'até 13h',
    ultimaColheita: true,
    imagem: '🥔',
  },
];

const categorias = ['Todas', 'Verduras', 'Legumes', 'Frutas', 'Temperos', 'Raízes'];

function App() {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [categoria, setCategoria] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [reservas, setReservas] = useState(0);
  const [form, setForm] = useState({
    nome: '',
    produtor: '',
    categoria: 'Verduras',
    preco: '',
    quantidade: '',
  });

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const categoriaOk = categoria === 'Todas' || produto.categoria === categoria;
      const texto = `${produto.nome} ${produto.produtor} ${produto.categoria}`.toLowerCase();
      const buscaOk = texto.includes(busca.toLowerCase());
      return categoriaOk && buscaOk;
    });
  }, [produtos, categoria, busca]);

  const indicadores = {
    produtos: produtos.length,
    reservas,
    excedentes: produtos.filter((produto) => produto.ultimaColheita).length * 4,
    agua: 15,
    residuos: 15,
  };

  const indiceSabia = Math.min(
    100,
    Math.round(
      indicadores.produtos * 2 +
        indicadores.reservas * 4 +
        indicadores.excedentes +
        indicadores.agua +
        indicadores.residuos
    )
  );

  function reservar(produto) {
    setReservas((atual) => atual + 1);
    alert(`Reserva registrada para ${produto.nome}. Combine pagamento e retirada diretamente com o produtor.`);
  }

  function cadastrarProduto(event) {
    event.preventDefault();

    if (!form.nome || !form.produtor || !form.preco || !form.quantidade) {
      alert('Preencha todos os campos do cadastro.');
      return;
    }

    const novoProduto = {
      id: Date.now(),
      nome: form.nome,
      produtor: form.produtor,
      categoria: form.categoria,
      preco: Number(form.preco),
      unidade: 'unidade',
      quantidade: Number(form.quantidade),
      local: 'Local a combinar',
      horario: 'horário a combinar',
      ultimaColheita: false,
      imagem: '🧺',
    };

    setProdutos((atuais) => [novoProduto, ...atuais]);
    setForm({ nome: '', produtor: '', categoria: 'Verduras', preco: '', quantidade: '' });
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-texto">
          <span className="selo"><Leaf size={18} /> MVP Agroalimentar Circular</span>
          <h1>SABIÁ Market</h1>
          <p>Sistema Agroalimentar Biointeligente de Água, Alimentos, Adubo e Mercado Local.</p>
          <strong>Produzir melhor, vender a tempo, desperdiçar menos e devolver vida ao solo.</strong>
          <div className="hero-acoes">
            <a href="#catalogo">Ver catálogo</a>
            <a href="#dashboard" className="secundario">Ver impacto</a>
          </div>
        </div>
        <div className="hero-card">
          <Sprout size={48} />
          <h2>Da terra à mesa, da mesa ao solo.</h2>
          <p>Marketplace, Última Colheita, Água Inteligente, BioMerenda e dados em uma única solução.</p>
        </div>
      </section>

      <section className="modulos">
        <Modulo icone={<ShoppingBasket />} titulo="Mercado Local" texto="Produtos, preços, filtros e reservas." />
        <Modulo icone={<Leaf />} titulo="Última Colheita" texto="Excedentes com desconto ou destino social." />
        <Modulo icone={<Droplets />} titulo="Água Inteligente" texto="Registro de umidade e irrigação." />
        <Modulo icone={<Recycle />} titulo="BioMerenda" texto="Resíduos vegetais virando composto." />
      </section>

      <section id="catalogo" className="secao">
        <div className="topo-secao">
          <div>
            <p className="subtitulo">Marketplace</p>
            <h2>Catálogo de produtos locais</h2>
          </div>
          <div className="busca">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar produto ou produtor"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
        </div>

        <div className="filtros">
          {categorias.map((item) => (
            <button
              key={item}
              className={categoria === item ? 'ativo' : ''}
              onClick={() => setCategoria(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grade-produtos">
          {produtosFiltrados.map((produto) => (
            <article className="produto" key={produto.id}>
              {produto.ultimaColheita && <span className="tag">Última Colheita</span>}
              <div className="emoji">{produto.imagem}</div>
              <h3>{produto.nome}</h3>
              <p>{produto.produtor}</p>
              <strong>R$ {produto.preco.toFixed(2).replace('.', ',')} / {produto.unidade}</strong>
              <div className="detalhes"><MapPin size={16} /> {produto.local}</div>
              <div className="detalhes"><Clock size={16} /> {produto.horario}</div>
              <button onClick={() => reservar(produto)}>
                <MessageCircle size={18} /> Reservar
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="secao duas-colunas">
        <form className="formulario" onSubmit={cadastrarProduto}>
          <p className="subtitulo">Painel do produtor</p>
          <h2>Cadastrar produto</h2>
          <input placeholder="Nome do produto" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <input placeholder="Nome do produtor" value={form.produtor} onChange={(e) => setForm({ ...form, produtor: e.target.value })} />
          <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
            {categorias.filter((item) => item !== 'Todas').map((item) => <option key={item}>{item}</option>)}
          </select>
          <input type="number" min="0" step="0.01" placeholder="Preço" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
          <input type="number" min="0" placeholder="Quantidade disponível" value={form.quantidade} onChange={(e) => setForm({ ...form, quantidade: e.target.value })} />
          <button type="submit"><PlusCircle size={18} /> Adicionar ao catálogo</button>
        </form>

        <div className="ultima-colheita">
          <p className="subtitulo">Vitrine especial</p>
          <h2>Última Colheita</h2>
          <p>Produtos em bom estado, mas com risco de sobra, recebem uma nova chance de venda, doação ou reaproveitamento.</p>
          <div className="lista-excedentes">
            {produtos.filter((produto) => produto.ultimaColheita).map((produto) => (
              <div key={produto.id}>
                <span>{produto.imagem}</span>
                <strong>{produto.nome}</strong>
                <small>{produto.quantidade} disponíveis</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="secao dashboard">
        <div className="topo-secao">
          <div>
            <p className="subtitulo">Dashboard SABIÁ</p>
            <h2>Indicadores de impacto</h2>
          </div>
          <BarChart3 size={36} />
        </div>

        <div className="cards-indicadores">
          <Indicador valor={indicadores.produtos} rotulo="Produtos ativos" />
          <Indicador valor={indicadores.reservas} rotulo="Pedidos/reservas" />
          <Indicador valor={`${indicadores.excedentes} kg`} rotulo="Excedentes aproveitados" />
          <Indicador valor={`${indicadores.agua}%`} rotulo="Economia de água" />
          <Indicador valor={`${indicadores.residuos} kg`} rotulo="Resíduos compostados" />
          <Indicador valor={indiceSabia} rotulo="Índice SABIÁ" />
        </div>
      </section>
    </main>
  );
}

function Modulo({ icone, titulo, texto }) {
  return (
    <article>
      {icone}
      <h3>{titulo}</h3>
      <p>{texto}</p>
    </article>
  );
}

function Indicador({ valor, rotulo }) {
  return (
    <article>
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);

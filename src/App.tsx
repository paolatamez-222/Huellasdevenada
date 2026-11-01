import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CircleUserRound, Heart,
  Leaf, Menu, Moon, Plus, Minus, Search, ShoppingBag, Sun, X, Check,
  Instagram, Mail, MapPin, Trash2, Sparkles, Send
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

type Category = 'Blusas' | 'Capas' | 'Bolsas' | 'Joyería';
type Product = {
  id: number; name: string; category: Category; price: number; color: string;
  image: string; description: string; material: string; size: string;
  artisan: string; time: string; badge?: string; rating: number; featured: boolean; created: number;
};
type CartItem = { product: Product; quantity: number };
type HotspotPoint = { left: string; top: string };
type SymbolItem = { title: string; meaning: string; phrase: string; points: HotspotPoint[] };

const brandLogo = '/images/branding/LogoVenado.png';
const historyImage = '/images/about/Nuestrahistoria.jpeg';
const heroes = ['/images/carousel/Carruselfoto1.jpeg', '/images/carousel/carruselfoto2.jpeg', '/images/carousel/carruselfoto4.jpeg', '/images/carousel/Carruselfoto5 copy.jpeg', '/images/carousel/Carruselfoto5.jpeg'];
const products: Product[] = [
  { id: 2, name: 'Capa Corazón', category: 'Capas', price: 1450, color: 'Rojo', image: '/images/shop/Tienda-Capas-CapaCorazón.jpg', description: 'Capa tejida con flecos y un diseño que celebra el corazón de la tradición mazahua.', material: 'Algodón tejido a mano', size: '180 x 70 cm', artisan: 'Noelia Gómez', time: '18 días', badge: 'Pieza única', rating: 5, featured: true, created: 12 },
  { id: 3, name: 'Bolsa Venada', category: 'Bolsas', price: 890, color: 'Crudo', image: '/images/shop/Tienda-Bolsas-BolsaVenada.jpg', description: 'Bolsa bordada con la figura del venado como símbolo de protección y guía.', material: 'Manta de algodón y bordado de hilo', size: '28 x 24 x 8 cm', artisan: 'María Elena', time: '9 días', rating: 5, featured: true, created: 11 },
  { id: 4, name: 'Aretes Estrella', category: 'Joyería', price: 420, color: 'Verde', image: '/images/inspiration/Tienda-Joyería-Aretes_Estrella.png', description: 'Aretes bordados a mano con una flor mazahua de colores vivos.', material: 'Hilo de algodón y acero hipoalergénico', size: '5 cm de largo', artisan: 'Noelia Gómez', time: '3 días', badge: 'Nuevo', rating: 5, featured: false, created: 14 },
  { id: 5, name: 'Aretes Suerte', category: 'Joyería', price: 420, color: 'Verde', image: '/images/shop/Tienda-Joyeria-AretesSuerte.png', description: 'Aretes tejidos a mano con una combinación de verdes y pequeños acentos florales.', material: 'Hilo de algodón y acero hipoalergénico', size: '5 cm de largo', artisan: 'María Elena', time: '3 días', rating: 5, featured: false, created: 8 },
  { id: 6, name: 'Blusa Estrella de Ancestros', category: 'Blusas', price: 1680, color: 'Crudo', image: '/images/about/Tienda-Blusas-BlusaEstrelladeAncestros.jpeg', description: 'Blusa de manta con bordado geométrico inspirado en la memoria y la identidad mazahua.', material: 'Manta de algodón y bordado de hilo', size: 'Unitalla, 60 cm de alto x 68 cm de ancho', artisan: 'Noelia Gómez', time: '21 días', rating: 5, featured: false, created: 7 },
  { id: 7, name: 'Blusa Huella Venada', category: 'Blusas', price: 1580, color: 'Crudo', image: '/images/branding/Tienda-Blusas_BlusaHuellaVenada.jpeg', description: 'Blusa artesanal con venados bordados que representan protección y guía.', material: 'Manta de algodón y bordado de hilo', size: 'Unitalla, 60 cm de alto x 68 cm de ancho', artisan: 'María Elena', time: '18 días', rating: 5, featured: false, created: 6 },
  { id: 8, name: 'Blusa Dulce Amor', category: 'Blusas', price: 1490, color: 'Fucsia', image: '/images/about/Tienda-Blusas-BlusaDulceAmor.jpeg', description: 'Blusa en tono fucsia con detalles dorados y un bordado que celebra el cariño.', material: 'Algodón y bordado de hilo', size: 'Unitalla, 58 cm de alto x 66 cm de ancho', artisan: 'Noelia Gómez', time: '16 días', rating: 5, featured: false, created: 5 },
  { id: 9, name: 'Bolsa La Vida', category: 'Bolsas', price: 920, color: 'Fucsia', image: '/images/shop/Tienda-Bolsas-BolsaLaVida.jpg', description: 'Bolsa colorida con bordados que representan los caminos y momentos de la vida.', material: 'Tela bordada a mano', size: '30 x 27 x 8 cm', artisan: 'María Elena', time: '10 días', rating: 5, featured: false, created: 10 },
  { id: 10, name: 'Bolsa Los Pajaritos', category: 'Bolsas', price: 860, color: 'Crudo', image: '/images/shop/Tienda-Bolsas-BolsaLosPajaritos.jpg', description: 'Bolsa de fondo claro con pájaros y flores bordados en colores vivos.', material: 'Tela de algodón y bordado de hilo', size: '28 x 25 x 7 cm', artisan: 'Noelia Gómez', time: '9 días', rating: 5, featured: false, created: 9 },
  { id: 11, name: 'Capa El Baile de la Venada', category: 'Capas', price: 1580, color: 'Multicolor', image: '/images/shop/Tienda-Capas-CapaElbailedelaVenada.jpg', description: 'Capa blanca con venados multicolores que celebra el movimiento y la alegría.', material: 'Algodón tejido y bordado', size: '180 x 75 cm', artisan: 'María Elena', time: '20 días', rating: 5, featured: false, created: 8 },
  { id: 12, name: 'Aretes Papalote', category: 'Joyería', price: 420, color: 'Naranja', image: '/images/shop/Tienda-Joyeria-AretesPapalote.png', description: 'Aretes bordados a mano con formas coloridas y flecos que celebran el movimiento del papalote.', material: 'Hilo de algodón y acero hipoalergénico', size: '5 cm de largo', artisan: 'Noelia Gómez', time: '3 días', rating: 5, featured: false, created: 13 },
];

const money = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);

function App() {
  const [dark, setDark] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState('Todas');
  const [color, setColor] = useState('Colores');
  const [sort, setSort] = useState('recent');
  const [carousel, setCarousel] = useState(0);
  const [contactSent, setContactSent] = useState(false);
  const [query, setQuery] = useState('');
  const [symbol, setSymbol] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [deerRunning, setDeerRunning] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCarousel((current) => (current + 1) % heroes.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setAuthMessage('');
    setAuthOpen(true);
  };

  const handleAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthMessage('');
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const name = String(formData.get('name') ?? '');
    const country = String(formData.get('country') ?? '');
    if (!supabase) {
      setAuthError('El acceso estará disponible cuando la conexión de cuentas esté activa.');
      setAuthLoading(false);
      return;
    }
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { data: { name, country } } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) setAuthError('No pudimos completar el acceso. Revisa tus datos e inténtalo de nuevo.');
    else if (authMode === 'signup' && !result.data.session) setAuthMessage('Tu cuenta fue creada. Ya puedes iniciar sesión.');
    else setAuthOpen(false);
    setAuthLoading(false);
  };

  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todas' || product.category === category;
    const matchesColor = color === 'Colores' || product.color === color;
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesColor && matchesQuery;
  }).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : b.created - a.created), [category, color, sort, query]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const addToCart = (product: Product) => {
    setCart((current) => current.some((item) => item.product.id === product.id)
      ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { product, quantity: 1 }]);
    setNotice(`${product.name} se agregó a tu bolsa`);
    setTimeout(() => setNotice(''), 2600);
  };
  const changeQuantity = (id: number, delta: number) => setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeFromCart = (id: number) => setCart((current) => current.filter((item) => item.product.id !== id));
  const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((favoriteId) => favoriteId !== id) : [...current, id]);
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));
  const goTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false); if (id === 'inicio') setDeerRunning(true); };

  const symbols: SymbolItem[] = [
    { title: 'El venado', meaning: 'Protección y guía. Muestra el camino a quienes viajan para que no se pierdan en el monte.', phrase: 'Deja huella en el camino', points: [{ left: '40%', top: '41%' }, { left: '60%', top: '41%' }] },
    { title: 'El camino de la vida', meaning: 'Sus subidas, bajadas y tramos planos representan las experiencias alegres y difíciles del ser humano.', phrase: 'Todo camino cuenta', points: [{ left: '50%', top: '24%' }] },
    { title: 'La estrella de picos', meaning: 'La estrella de ocho picos es flor mazahua y guardiana de la noche, protectora de la salud y mensajera de buenas noticias.', phrase: 'Luz para volver a casa', points: [{ left: '50%', top: '66%' }] },
    { title: 'El maíz', meaning: 'Simbolizan la fertilidad y la abundancia de la tierra para el pueblo mazahua.', phrase: 'La tierra que alimenta', points: [{ left: '31%', top: '63%' }, { left: '69%', top: '63%' }] },
    { title: 'El sol y la luna', meaning: 'Junto con el lucero forman una tríada sagrada que equilibra la salud y la enfermedad.', phrase: 'El equilibrio de la vida', points: [{ left: '24%', top: '21%' }, { left: '76%', top: '21%' }] },
    { title: 'El color rojo', meaning: 'Se utiliza para conmemorar y honrar a los ancestros.', phrase: 'Memoria que permanece', points: [{ left: '50%', top: '44%' }] },
    { title: 'El pájaro', meaning: 'Anuncia los cambios de estación, marcando los ciclos de migración y dando la bienvenida al Sol.', phrase: 'El vuelo que anuncia la vida', points: [{ left: '40%', top: '33%' }, { left: '60%', top: '33%' }] },
  ];

  return <div className={dark ? 'app dark' : 'app'}>
    <div className="shipping">Envíos gratis en México en compras mayores a $2,500 MXN <span>·</span> Cada compra apoya directamente a nuestras artesanas</div>
    <header className="header">
      <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menú">{mobileMenu ? <X /> : <Menu />}</button>
      <button className="brand" onClick={() => goTo('inicio')}><span className="brand-mark"><img src={brandLogo} alt="Venado de Huellas de Venada" /></span><span><strong>Huellas de Venada</strong><small>ARTESANÍA MAZAHUA</small></span></button>
      <nav className={mobileMenu ? 'nav open' : 'nav'}><button onClick={() => goTo('inicio')}>Inicio</button><button onClick={() => goTo('historia')}>Nuestra historia</button><button onClick={() => goTo('artesanas')}>Conoce a las artesanas</button><button onClick={() => goTo('tienda')}>Tienda</button></nav>
      <div className="header-actions"><button className="icon-button" aria-label="Buscar" onClick={() => goTo('tienda')}><Search /></button><button className="icon-button theme-toggle" aria-label="Cambiar tema" onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button><button className="account" onClick={() => openAuth()}><CircleUserRound /><span>{session ? 'Mi cuenta' : 'Entrar'}</span></button><button className="cart-button favorites-button" onClick={() => setFavoritesOpen(true)} aria-label="Abrir favoritos"><Heart fill={favorites.length ? 'currentColor' : 'none'} /><b>{favorites.length}</b></button><button className="cart-button" onClick={() => setCartOpen(true)} aria-label="Abrir carrito"><ShoppingBag /><b>{cartCount}</b></button></div>
    </header>

    <main>
      <section id="inicio" className="hero section-wrap"><div className="hero-copy"><p className="eyebrow">ARTESANÍA MAZAHUA · HECHA A MANO</p><h1>Tradición que deja huella, <em>arte que nos conecta.</em></h1><p className="lead">Cada pieza cuenta una historia. Cada bordado lleva consigo el talento de unas manos que mantienen viva una tradición.</p><p>En Huellas de Venada acercamos el trabajo de las mujeres artesanas mazahuas a ti, promoviendo la venta de sus creaciones y reconociendo el valor de su arte.</p><button className="primary-button" onClick={() => goTo('tienda')}>Descubre nuestra colección <ArrowRight size={17} /></button><div className="hero-note"><span><Leaf size={16} /> 100% hecho a mano</span><span><Heart size={16} /> Compra con propósito</span></div></div><div className="hero-gallery"><div className="hero-image"><img src={heroes[carousel]} alt="Textiles y artesanía mazahua" /><button className="circle-arrow left" onClick={() => setCarousel((current) => (current + heroes.length - 1) % heroes.length)} aria-label="Imagen anterior"><ChevronLeft /></button><button className="circle-arrow right" onClick={() => setCarousel((current) => (current + 1) % heroes.length)} aria-label="Siguiente imagen"><ChevronRight /></button><div className="dots">{heroes.map((_, i) => <span key={i} className={i === carousel ? 'active' : ''} />)}</div></div><div className="gallery-caption"><span>01 — La belleza de lo lento</span><span>Tradición viva, presente y futura</span></div></div></section>

      <section id="tienda" className="shop section-wrap"><div className="section-heading"><div><p className="eyebrow">COLECCIÓN DE TEMPORADA</p><h2>Nuestra tienda <span>✳</span></h2><p>Descubre prendas y textiles elaborados a mano por mujeres artesanas mazahuas.</p></div><div className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar una pieza..." /></div></div><div className="shop-toolbar"><div className="filters"><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todas</option><option>Blusas</option><option>Capas</option><option>Bolsas</option><option>Joyería</option></select><select value={color} onChange={(e) => setColor(e.target.value)}><option>Colores</option><option>Crudo</option><option>Fucsia</option><option>Verde</option><option>Naranja</option><option>Amarillo</option><option>Morado</option><option>Rojo</option><option>Multicolor</option></select></div><label className="sort-label">Ordenar por <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Más recientes</option><option value="low">Precio menor</option><option value="high">Precio mayor</option></select><ChevronDown size={15} /></label></div><div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} />{product.badge && <span className="badge">{product.badge}</span>}<button className={favorites.includes(product.id) ? 'like active' : 'like'} aria-label={favorites.includes(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'} onClick={() => toggleFavorite(product.id)}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={() => addToCart(product)}><Plus size={15} /> Agregar</button></div><button className="product-info" onClick={() => setSelected(product)}><span className="category-label">{product.category}</span><h3>{product.name}</h3><div className="product-bottom"><strong>{money(product.price)}</strong><span>{'★'.repeat(product.rating)}</span></div></button></article>)}</div>{filtered.length === 0 && <div className="empty-state">No encontramos piezas con esos filtros. Prueba otra combinación.</div>}</section>

      <section className="story-band" id="historia"><div className="story-image"><img src={historyImage} alt="Nuestra historia Huellas de Venada" /></div><div className="story-copy"><p className="eyebrow">NUESTRA HISTORIA</p><h2>Vestir la memoria, <em>honrar las manos.</em></h2><p>Huellas de Venada nace para acercar el arte mazahua a nuevos espacios y personas. Creemos que cada puntada merece ser reconocida, y que cada mujer artesana debe recibir un pago justo por el tiempo, saber y corazón que pone en su trabajo.</p><p>Más que una tienda, somos un puente entre la tradición y la vida contemporánea.</p><blockquote>“Tradición que deja huella, arte que nos conecta”.</blockquote><button className="text-button" onClick={() => goTo('artesanas')}>Conoce nuestra historia <ArrowRight size={16} /></button></div></section>

      <section id="artesanas" className="artesanas section-wrap"><div className="section-heading centered"><div><p className="eyebrow">LAS MANOS DETRÁS DE CADA PIEZA</p><h2>Conoce a las artesanas</h2><p>Ellas mantienen viva una tradición que se transforma sin perder sus raíces.</p></div></div><div className="artisan-grid"><article className="artisan-card featured-artisan"><img src="/images/inspiration/artesanaMaríaElena.jpeg" alt="María Elena, artesana mazahua" /><div><span>Villa de Allende</span><h3>María Elena</h3><p>“Aprendí a bordar mirando a mi abuela. Hoy cada flor lleva algo de las dos.”</p></div></article><article className="artisan-card"><img src="/images/inspiration/ArtesanaNoeliaGómez.jpeg" alt="Noelia Gómez, artesana mazahua" /><div><span>Villa de Allende</span><h3>Noelia Gómez</h3><p>Tejedora y guardiana de los caminos de la vida.</p></div></article><article className="artisan-card color-card"><Sparkles size={28} /><h3>Tu compra deja huella</h3><p>Con cada pieza apoyas el trabajo digno y la autonomía económica de una mujer artesana.</p><button className="text-button" onClick={() => goTo('tienda')}>Ver la colección <ArrowRight size={16} /></button></article></div></section>

      <section className="symbols section-wrap"><div className="section-heading centered"><div><p className="eyebrow">LO QUE CUENTA CADA BORDADO</p><h2>Simbología que nos acompaña</h2><p>Explora la blusa tradicional y descubre la historia que guarda cada bordado.</p></div></div><div className="symbols-layout"><div className="blouse-interactive"><img src="/images/shop/Captura_de_pantalla_2026-10-31_a_la(s)_6.39.21_p.m..png" alt="Blusa tradicional mazahua con bordados" />{symbols.flatMap((item, index) => item.points.map((point, pointIndex) => <button key={`${item.title}-${pointIndex}`} className={symbol === index ? 'blouse-hotspot selected' : 'blouse-hotspot'} style={point} onClick={() => setSymbol(index)} aria-label={`Explorar ${item.title}`}><span>{index + 1}</span></button>))}</div><div className="symbol-copy"><span className="symbol-number">0{symbol + 1} / 07</span><h3>{symbols[symbol].title}</h3><p>{symbols[symbol].meaning}</p><span className="symbol-phrase">{symbols[symbol].phrase}</span><div className="symbol-tabs">{symbols.map((item, index) => <button key={item.title} className={symbol === index ? 'active' : ''} onClick={() => setSymbol(index)}>{item.title}</button>)}</div></div></div></section>

      <section className="contact section-wrap"><div><p className="eyebrow">ESTAMOS PARA ESCUCHARTE</p><h2>Conversemos</h2><p>¿Tienes dudas sobre una pieza, una medida o quieres conocer más de nuestro trabajo? Escríbenos.</p><div className="contact-detail"><span><Mail size={17} /> hola@huellasdevenada.mx</span><span><MapPin size={17} /> Estado de México, México</span><span><Instagram size={17} /> @huellasdevenada</span></div></div><form onSubmit={(e) => { e.preventDefault(); setContactSent(true); }} className="contact-form">{contactSent ? <div className="sent"><Check size={30} /><h3>Mensaje recibido</h3><p>Gracias por escribirnos. Te responderemos pronto.</p><button type="button" className="text-button" onClick={() => setContactSent(false)}>Enviar otro mensaje</button></div> : <><div className="form-row"><label>Nombre<input required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\\s]+" title="Escribe solo letras, espacios y acentos" placeholder="Tu nombre" onChange={(event) => { event.currentTarget.value = event.currentTarget.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\\s]/g, ''); }} /></label><label>Correo electrónico<input required type="email" placeholder="tu@correo.com" /></label></div><label>Asunto<input required placeholder="¿En qué podemos ayudarte?" /></label><label>Mensaje<textarea required rows={4} placeholder="Cuéntanos..."></textarea></label><button className="primary-button" type="submit">Enviar mensaje <Send size={16} /></button></>}</form></section>
    </main>

    <footer><button className="brand footer-brand" onClick={() => goTo('inicio')}><span className="brand-mark"><img src={brandLogo} alt="Venado de Huellas de Venada" /></span><span><strong>Huellas de Venada</strong><small>ARTESANÍA MAZAHUA</small></span></button><p>Tradición que deja huella, arte que nos conecta.</p><span>© 2026 Huellas de Venada · Hecho con respeto</span></footer>

    {deerRunning && <div className="deer-runner" onAnimationEnd={() => setDeerRunning(false)}><img src={brandLogo} alt="" /></div>}
    {notice && <div className="notice"><Check size={18} /> {notice}</div>}
    {authOpen && <div className="modal-backdrop" onClick={() => setAuthOpen(false)}><div className="auth-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setAuthOpen(false)}><X /></button><div className="auth-mark"><CircleUserRound size={28} /></div><p className="eyebrow">HUELLAS DE VENADA</p><h2>{authMode === 'login' ? 'Qué gusto verte' : 'Crea tu cuenta'}</h2><p className="auth-intro">{authMode === 'login' ? 'Ingresa para guardar tus piezas favoritas.' : 'Forma parte de nuestra comunidad y guarda tus piezas favoritas.'}</p><div className="auth-tabs"><button className={authMode === 'login' ? 'active' : ''} onClick={() => openAuth('login')}>Iniciar sesión</button><button className={authMode === 'signup' ? 'active' : ''} onClick={() => openAuth('signup')}>Crear cuenta</button></div>{authMessage && <div className="auth-message">{authMessage}</div>}{authError && <div className="auth-error">{authError}</div>}{session ? <div className="signed-in"><Check size={25} /><p>Ya has iniciado sesión.</p><button className="text-button" onClick={async () => { if (supabase) await supabase.auth.signOut(); setAuthOpen(false); }}>Cerrar sesión</button></div> : <form className="auth-form" onSubmit={handleAuth}>{authMode === 'signup' && <><label>Nombre<input name="name" required pattern="[A-Za-zÁÉÍÓÚáéíóúÑñÜü\\s]+" title="Escribe solo letras, espacios y acentos" placeholder="Tu nombre" /></label><label>País de residencia<select name="country" required defaultValue=""><option value="" disabled>Selecciona tu país</option><option>México</option><option>Estados Unidos</option><option>Canadá</option><option>Otro país</option></select></label></>}<label>Correo electrónico<input name="email" required type="email" placeholder="tu@correo.com" /></label><label>Contraseña<input name="password" required type="password" minLength={6} placeholder="Mínimo 6 caracteres" /></label><button className="primary-button full" type="submit" disabled={authLoading}>{authLoading ? 'Procesando...' : authMode === 'login' ? 'Entrar a mi cuenta' : 'Crear mi cuenta'} <ArrowRight size={16} /></button></form>}</div></div>}
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="product-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}><X /></button><div className="modal-image"><img src={selected.image} alt={selected.name} /></div><div className="modal-content"><span className="category-label">{selected.category}</span><h2>{selected.name}</h2><div className="modal-price">{money(selected.price)}</div><p>{selected.description}</p><div className="detail-list"><span><b>Material</b>{selected.material}</span><span><b>Medidas</b>{selected.size}</span><span><b>Artesana</b>{selected.artisan}</span><span><b>Tiempo de elaboración</b>{selected.time}</span></div><button className="primary-button full" onClick={() => { addToCart(selected); setSelected(null); }}>Agregar a mi bolsa <ShoppingBag size={17} /></button></div></div></div>}
    {favoritesOpen && <div className="drawer-backdrop" onClick={() => setFavoritesOpen(false)}><aside className="cart-drawer favorites-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">TUS PIEZAS GUARDADAS</p><h2>Lista de Favoritos <span>({favorites.length})</span></h2></div><button onClick={() => setFavoritesOpen(false)}><X /></button></div>{favoriteProducts.length === 0 ? <div className="cart-empty"><Heart size={40} /><h3>Aún no tienes favoritos</h3><p>Presiona el corazón de una pieza para guardarla aquí.</p><button className="primary-button" onClick={() => { setFavoritesOpen(false); goTo('tienda'); }}>Explorar colección</button></div> : <div className="cart-items">{favoriteProducts.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><span>{money(product.price)}</span><button className="text-button" onClick={() => { setFavoritesOpen(false); setSelected(product); }}>Ver pieza <ArrowRight size={14} /></button></div><button className="remove" onClick={() => toggleFavorite(product.id)} aria-label={`Quitar ${product.name} de favoritos`}><Heart size={15} fill="currentColor" /></button></div>)}</div>}</aside></div>}
    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">TU SELECCIÓN</p><h2>Mi bolsa <span>({cartCount})</span></h2></div><button onClick={() => setCartOpen(false)}><X /></button></div>{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={40} /><h3>Tu bolsa está esperando</h3><p>Agrega piezas con historia para comenzar.</p><button className="primary-button" onClick={() => { setCartOpen(false); goTo('tienda'); }}>Explorar colección</button></div> : <><div className="cart-items">{cart.map(({ product, quantity }) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div><h3>{product.name}</h3><span>{money(product.price)}</span><div className="quantity"><button onClick={() => changeQuantity(product.id, -1)}><Minus size={13} /></button><b>{quantity}</b><button onClick={() => changeQuantity(product.id, 1)}><Plus size={13} /></button></div></div><button className="remove" onClick={() => removeFromCart(product.id)}><Trash2 size={15} /></button></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Envío gratis en compras mayores a $2,500 MXN</p><button className="primary-button full" onClick={() => setNotice('Este prototipo no procesa pagos reales')}>Continuar con mi pedido <ArrowRight size={17} /></button></div></>}</aside></div>}
  </div>;
}

export default App;

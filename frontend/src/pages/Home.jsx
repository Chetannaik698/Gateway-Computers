import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services, whyChooseUs, stats, getWhatsAppLink, PHONE_DISPLAY } from '../data/data';
import api from '../utils/api';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const featuredServices = services.slice(0, 3);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        if (response.data.success) {
          setFeaturedProducts(response.data.products.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge animate-fade-in-up">
              <span className="pulse-dot" />
              Gateway Computer – Trusted Tech Shop
            </div>
            <h1 className="hero-title animate-fade-in-up">
              Gateway<br />
              <span>Computers</span>
            </h1>
            <p className="hero-tagline animate-fade-in-up">Your Trusted Tech Partner</p>
            <p className="hero-desc animate-fade-in-up">
              Expert computer repairs, CCTV installation, laptop sales, printer services,
              and custom gaming PC builds — all under one roof.
            </p>
            <div className="hero-actions animate-fade-in-up">
              <a href={`tel:+919591064356`} className="btn btn-primary btn-lg">
                <i className="fa-solid fa-phone" /> Call Now
              </a>
              <a href={getWhatsAppLink('Hi! I need help with a tech service.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <i className="fa-brands fa-whatsapp" /> WhatsApp
              </a>
              <Link to="/booking" className="btn btn-ghost btn-lg">
                <i className="fa-solid fa-calendar-check" /> Book Service
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map(s => (
                <div key={s.label} className="hero-stat">
                  <div className="hero-stat-val">{s.value}</div>
                  <div className="hero-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-float hero-card-1">
              <i className="fa-solid fa-shield-halved" />
              <div>
                <div>CCTV Installed</div>
                <small>500+ setups done</small>
              </div>
            </div>
            <div className="hero-orb">
              <i className="fa-solid fa-microchip" />
            </div>
            <div className="hero-card-float hero-card-2">
              <i className="fa-solid fa-star" style={{color:'#fbbf24'}} />
              <div>
                <div>Top Rated</div>
                <small>2000+ happy clients</small>
              </div>
            </div>
            <div className="hero-card-float hero-card-3">
              <i className="fa-solid fa-bolt" />
              <div>
                <div>Same Day Repair</div>
                <small>Fast turnaround</small>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-hint">
          <i className="fa-solid fa-chevron-down" />
        </div>
      </section>

      {/* ── SERVICES PREVIEW ── */}
      <section className="section services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Do</span>
            <h2 className="section-title">Our <span>Services</span></h2>
            <p className="section-subtitle">From CCTV installation to custom gaming PCs — we've got you covered with expert tech solutions.</p>
          </div>
          <div className="grid-3 services-grid">
            {featuredServices.map((s, i) => (
              <div key={s.id} className="service-card card" style={{animationDelay:`${i*0.1}s`}}>
                <div className="service-card-icon">
                  <i className={`fa-solid ${s.icon}`} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
                <div className="service-card-price">{s.price}</div>
                <Link to="/booking" className="btn btn-outline btn-sm">
                  <i className="fa-solid fa-calendar-check" /> Book Now
                </Link>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/services" className="btn btn-primary">
              View All Services <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS PREVIEW ── */}
      <section className="section products-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Shop</span>
            <h2 className="section-title">Featured <span>Products</span></h2>
            <p className="section-subtitle">Browse our curated range of computers, accessories, CCTV gear, and more.</p>
          </div>
          <div className="grid-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="section-cta">
            <Link to="/products" className="btn btn-outline">
              Browse All Products <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section why-section">
        <div className="why-bg" />
        <div className="container">
          <div className="section-header centered">
            <span className="section-tag">Why Us</span>
            <h2 className="section-title">Why Choose <span>Gateway Computers</span>?</h2>
            <p className="section-subtitle" style={{margin:'0 auto'}}>We're not just a shop — we're your long-term tech partner. Here's what sets us apart.</p>
          </div>
          <div className="grid-3 why-grid">
            {whyChooseUs.map((w, i) => (
              <div key={i} className="why-card card">
                <div className="why-icon">
                  <i className={`fa-solid ${w.icon}`} />
                </div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner-glow" />
        <div className="container cta-banner-inner">
          <div>
            <h2>Ready to get started?</h2>
            <p>Call us or book a service online — we'll take care of the rest.</p>
          </div>
          <div className="cta-banner-actions">
            <a href={`tel:+919591064356`} className="btn btn-primary btn-lg">
              <i className="fa-solid fa-phone" /> {PHONE_DISPLAY}
            </a>
            <a href={getWhatsAppLink('Hi! I need help with a tech service.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <i className="fa-brands fa-whatsapp" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT / MAP ── */}
      <section className="section contact-strip">
        <div className="container">
          <div className="contact-strip-inner">
            <div className="contact-strip-info">
              <span className="section-tag">Find Us</span>
              <h2 className="section-title">Visit Our <span>Store</span></h2>
              <div className="contact-detail-list">
                <div className="contact-detail">
                  <div className="contact-icon"><i className="fa-solid fa-location-dot" /></div>
                  <div>
                    <strong>Address</strong>
                    <p>Gateway Computer, Karnataka, India</p>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-icon"><i className="fa-solid fa-phone" /></div>
                  <div>
                    <strong>Phone</strong>
                    <p><a href="tel:+919591064356">{PHONE_DISPLAY}</a></p>
                  </div>
                </div>
                <div className="contact-detail">
                  <div className="contact-icon"><i className="fa-solid fa-clock" /></div>
                  <div>
                    <strong>Hours</strong>
                    <p>Monday – Saturday: 9AM – 9PM</p>
                  </div>
                </div>
              </div>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'8px'}}>
                <a href="tel:+919591064356" className="btn btn-primary">
                  <i className="fa-solid fa-phone" /> Call Now
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=14.079034,74.502825" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  <i className="fa-solid fa-map" /> Get Directions
                </a>
              </div>
            </div>
            <div className="map-placeholder">
              <iframe
                title="Gateway Computer Location"
                src="https://www.google.com/maps?q=14.079034,74.502825&z=17&output=embed"
                width="100%"
                height="100%"
                style={{border:0, borderRadius:'var(--radius)'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }) {
  const msg = `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString('en-IN')}). Please share more details.`;
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400';
  return (
    <div className="prod-card card">
      <Link to={`/products/${product._id}`} className="prod-img-wrap" style={{display: 'block'}}>
        <img src={imageUrl} alt={product.name} loading="lazy" />
        {product.badge && <span className="badge prod-badge">{product.badge}</span>}
      </Link>
      <div className="prod-info">
        <div className="prod-cat">{product.category}</div>
        <Link to={`/products/${product._id}`} style={{textDecoration:'none', color:'inherit'}}>
          <h4>{product.name}</h4>
        </Link>
        <div className="prod-price">₹{product.price.toLocaleString('en-IN')}</div>
        <a href={getWhatsAppLink(msg)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm" style={{width:'100%',justifyContent:'center'}}>
          <i className="fa-brands fa-whatsapp" /> Enquire
        </a>
      </div>
    </div>
  );
}

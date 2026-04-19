import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWhatsAppLink } from '../data/data';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Products.css';

const productCategories = [
  { id: 'all', label: 'All Products', icon: 'fa-grip' },
  { id: 'laptops', label: 'Laptops', icon: 'fa-laptop' },
  { id: 'accessories', label: 'Computer Accessories', icon: 'fa-keyboard' },
  { id: 'cctv', label: 'CCTV Equipment', icon: 'fa-camera' },
  { id: 'printers', label: 'Printers', icon: 'fa-print' },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-tag">Shop</span>
          <h1 className="section-title">Our <span>Products</span></h1>
          <p className="section-subtitle">Quality tech products for every need and budget. Enquire on WhatsApp for best prices.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Filter Bar */}
          <div className="products-filter-bar">
            <div className="cat-tabs">
              {productCategories.map(c => (
                <button
                  key={c.id}
                  className={`cat-tab ${activeCategory === c.id ? 'cat-tab--active' : ''}`}
                  onClick={() => setActiveCategory(c.id)}
                >
                  <i className={`fa-solid ${c.icon}`} /> {c.label}
                </button>
              ))}
            </div>
            <div className="search-box">
              <i className="fa-solid fa-search" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="results-count">
            Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' && ` in ${productCategories.find(c => c.id === activeCategory)?.label}`}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="no-results">
              <i className="fa-solid fa-spinner fa-spin" />
              <h3>Loading products...</h3>
            </div>
          ) : filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="fa-solid fa-box-open" />
              <h3>No products found</h3>
              <p>Try adjusting your search or category filter.</p>
              <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveCategory('all'); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product: p }) {
  const msg = `Hi! I'm interested in ${p.name} (₹${p.price.toLocaleString('en-IN')}). Please share more details.`;
  // Use Cloudinary URL directly (already full URL)
  const imageUrl = p.images?.[0] || 'https://via.placeholder.com/400';
  
  const categoryLabels = {
    'laptops': 'Laptops',
    'accessories': 'Computer Accessories',
    'cctv': 'CCTV Equipment',
    'printers': 'Printers'
  };
  
  return (
    <div className="product-card card">
      <Link to={`/products/${p._id}`} className="product-img-wrap">
        <img src={imageUrl} alt={p.name} loading="lazy" />
        {p.badge && <span className="badge product-badge">{p.badge}</span>}
        <div className="product-overlay">
          <span><i className="fa-solid fa-eye" /> View Details</span>
        </div>
      </Link>
      <div className="product-body">
        <div className="product-cat-tag">{categoryLabels[p.category] || p.category}</div>
        <Link to={`/products/${p._id}`}><h3 className="product-name">{p.name}</h3></Link>
        <div className="product-specs">
          {p.specs.slice(0, 2).map(s => (
            <span key={s} className="spec-chip"><i className="fa-solid fa-check" /> {s}</span>
          ))}
        </div>
        <div className="product-footer">
          <div className="product-price">
            {p.originalPrice && p.originalPrice > p.price && (
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '14px', marginRight: '8px' }}>
                ₹{p.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            ₹{p.price.toLocaleString('en-IN')}
          </div>
          <div className="product-actions">
            <Link to={`/products/${p._id}`} className="btn btn-ghost btn-sm">Details</Link>
            <a href={getWhatsAppLink(msg)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm">
              <i className="fa-brands fa-whatsapp" /> Enquire
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

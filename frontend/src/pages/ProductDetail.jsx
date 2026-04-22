import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RazorpayPayment from '../components/RazorpayPayment';
import { getWhatsAppLink, productCategories } from '../data/data';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchRelated = async (categoryId) => {
    try {
      const res = await api.get(`/products/category/${categoryId}`);
      if (res.data.success) {
        setRelated(res.data.products.filter(p => p._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to load related products');
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data.success) {
        setProduct(response.data.product);
        fetchRelated(response.data.product.category);
      }
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{textAlign:'center',paddingTop:'160px'}}>
        <i className="fa-solid fa-spinner fa-spin" style={{fontSize:'64px',color:'var(--orange)',marginBottom:'24px'}} />
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-page">
        <div className="container" style={{textAlign:'center',paddingTop:'160px'}}>
          <i className="fa-solid fa-box-open" style={{fontSize:'64px',color:'var(--orange)',marginBottom:'24px'}} />
          <h2>Product Not Found</h2>
          <p style={{color:'var(--text-muted)',margin:'16px 0 32px'}}>This product doesn't exist or may have been removed.</p>
          <Link to="/products" className="btn btn-primary">← Back to Products</Link>
        </div>
      </div>
    );
  }

  const catLabel = productCategories.find(c => c.id === product.category)?.label;
  const waMsg    = `Hi! I'm interested in ${product.name} (₹${product.price.toLocaleString('en-IN')}). Please share more details.`;

  const deliveryCharge = product.size === 'large' ? 200 : 150;
  const totalAmount = (product.price * orderDetails.quantity) + deliveryCharge;

  const handleOrderSuccess = (order) => {
    // Order already created in RazorpayPayment component
    // Just show success and modal will close automatically
    console.log('Order created:', order);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <i className="fa-solid fa-chevron-right" />
          <Link to="/products">Products</Link>
          <i className="fa-solid fa-chevron-right" />
          <span>{catLabel}</span>
          <i className="fa-solid fa-chevron-right" />
          <span className="active">{product.name}</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="product-detail-grid">
            {/* Image */}
            <div className="pd-image-col">
              <div className="pd-img-frame">
                <img src={product.images?.[0] || 'https://via.placeholder.com/600'} alt={product.name} />
                {product.badge && <span className="badge pd-badge">{product.badge}</span>}
              </div>
              {product.images?.length > 1 && (
                <div className="pd-img-thumbnails">
                  {product.images.map((img, i) => (
                    <div key={i} className={`pd-thumb ${i===0?'pd-thumb--active':''}`}>
                      <img src={img} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pd-info-col">
              <div className="pd-category">
                <i className="fa-solid fa-tag" /> {catLabel || product.category}
              </div>
              <h1 className="pd-title">{product.name}</h1>
              
              <div className="pd-price-wrap">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '20px', marginRight: '12px' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <div className="pd-price">₹{product.price.toLocaleString('en-IN')}</div>
                <span className={`status ${product.isAvailable ? 'status-active' : 'status-outofstock'}`}>
                  {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="pd-rating">
                {[1,2,3,4,5].map(n => <i key={n} className="fa-solid fa-star" style={{color:'#fbbf24'}} />)}
                <span>(4.8 / 5 · 38 reviews)</span>
              </div>
              <p className="pd-desc">{product.description}</p>

              <div className="pd-specs-block">
                <h3>Key Specifications</h3>
                <div className="pd-specs-list">
                  {product.specs.map(s => (
                    <div key={s} className="pd-spec-row">
                      <i className="fa-solid fa-check-circle" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pd-actions">
                <a href="tel:+919591064356" className="btn btn-primary btn-lg">
                  <i className="fa-solid fa-phone" /> Call Now
                </a>
                <a href={getWhatsAppLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                  <i className="fa-brands fa-whatsapp" /> WhatsApp Enquiry
                </a>
                <button onClick={() => { setShowOrderModal(true); setOrderStep(1); }} className="btn btn-outline btn-lg">
                  <i className="fa-solid fa-shopping-cart" /> Buy Now
                </button>
              </div>

              <div className="pd-trust-badges">
                <div className="trust-badge"><i className="fa-solid fa-shield-halved" /> Genuine Product</div>
                <div className="trust-badge"><i className="fa-solid fa-truck-fast" /> Fast Delivery</div>
                <div className="trust-badge"><i className="fa-solid fa-headset" /> 24/7 Support</div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="pd-related">
              <div className="divider" />
              <h2 className="related-title">Similar Products</h2>
              <div className="grid-4">
                {related.map(p => (
                  <div key={p._id} className="related-card card">
                    <Link to={`/products/${p._id}`} className="related-img">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/200'} alt={p.name} />
                    </Link>
                    <div className="related-body">
                      <Link to={`/products/${p._id}`}><h4>{p.name}</h4></Link>
                      <div className="related-price">
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px', marginRight: '6px' }}>
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="upi-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="upi-modal-content order-modal-content" onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="upi-modal-close" onClick={() => setShowOrderModal(false)}>
              <i className="fa-solid fa-times" />
            </button>

            {orderStep === 1 ? (
              <div className="order-form-step">
                <h3>Order Details</h3>
                <div className="form-group" style={{marginBottom: '16px'}}>
                  <label>Full Name</label>
                  <input type="text" className="form-control" value={orderDetails.name} onChange={e => setOrderDetails({...orderDetails, name: e.target.value})} placeholder="Enter your full name" required />
                </div>
                <div className="form-group" style={{marginBottom: '16px'}}>
                  <label>Phone Number</label>
                  <input type="tel" className="form-control" value={orderDetails.phone} onChange={e => setOrderDetails({...orderDetails, phone: e.target.value})} placeholder="Enter your phone number" required />
                </div>
                <div className="form-group" style={{marginBottom: '16px'}}>
                  <label>Delivery Address</label>
                  <textarea className="form-control" style={{resize: 'vertical'}} value={orderDetails.address} onChange={e => setOrderDetails({...orderDetails, address: e.target.value})} placeholder="Enter full delivery address" rows="3" required></textarea>
                </div>
                <div className="form-group" style={{marginBottom: '20px'}}>
                  <label>Quantity</label>
                  <input type="number" className="form-control" value={orderDetails.quantity} onChange={e => setOrderDetails({...orderDetails, quantity: Math.max(1, parseInt(e.target.value) || 1)})} min="1" required />
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span className="summary-label">Item Total ({orderDetails.quantity} x ₹{product.price.toLocaleString('en-IN')})</span>
                    <span>₹{(product.price * orderDetails.quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Delivery Charge</span>
                    <span>₹{deliveryCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total Amount</span>
                    <span className="total-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{width: '100%', justifyContent: 'center', padding: '14px', fontSize: '16px'}}
                  onClick={() => {
                    if(!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
                      toast.error("Please fill all details");
                      return;
                    }
                    setOrderStep(2);
                  }}
                >
                  Proceed to Pay
                </button>
              </div>
            ) : (
              <div className="order-payment-step">
                <button onClick={() => setOrderStep(1)} className="btn btn-outline" style={{marginBottom: '20px', padding: '6px 14px', fontSize: '14px'}}>
                  <i className="fa-solid fa-arrow-left" style={{marginRight: '8px'}} /> Back
                </button>
                <RazorpayPayment 
                  amount={totalAmount} 
                  product={product}
                  customerDetails={orderDetails}
                  onSuccess={handleOrderSuccess}
                  onClose={() => {
                    setShowOrderModal(false);
                    setOrderStep(1);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

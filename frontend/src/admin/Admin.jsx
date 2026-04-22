import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Admin.css';

const NAV = [
  { id: 'dashboard',       icon: 'fa-chart-pie',      label: 'Dashboard'         },
  { id: 'add-product',     icon: 'fa-circle-plus',    label: 'Add Product'       },
  { id: 'manage-products', icon: 'fa-box',            label: 'Manage Products'   },
  { id: 'bookings',        icon: 'fa-calendar-check', label: 'Booking Requests'  },
  { id: 'orders',          icon: 'fa-shopping-cart',  label: 'Manage Orders'     },
  { id: 'contacts',        icon: 'fa-envelope',       label: 'Contact Messages'  },
  { id: 'services',        icon: 'fa-concierge-bell', label: 'Manage Services'   },
];

export default function Admin() {
  const [page, setPage]       = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [addForm, setAddForm] = useState({ 
    name:'', 
    category:'laptops', 
    price:'', 
    originalPrice: '',
    stock:'', 
    desc: '',
    images: [],
    specs: ''
  });
  const [addSuccess, setAddSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'laptops',
    price: '',
    originalPrice: '',
    stock: '',
    desc: '',
    badge: '',
    specs: ''
  });
  const navigate = useNavigate();
  const { user, logout, isAdmin, token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (token && user && !isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [token, user, isAdmin, navigate]);

  useEffect(() => {
    if (token) {
      fetchProducts();
      fetchBookings();
      fetchOrders();
      fetchContacts();
      fetchServices();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProductList(response.data.products);
      }
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      if (response.data.success) {
        setBookingList(response.data.bookings);
      }
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrderList(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      if (response.data.success) {
        setContactList(response.data.contacts);
      }
    } catch (error) {
      toast.error('Failed to load contacts');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (response.data.success) {
        setServiceList(response.data.services);
      }
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChange = e => setAddForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setAddForm(f => ({ ...f, images: files }));
  };

  const handleAddSubmit = async () => {
    if (!addForm.name || !addForm.price || !addForm.category) {
      toast.error('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    // Validate category is one of the allowed values
    const validCategories = ['laptops', 'accessories', 'cctv', 'printers'];
    if (!validCategories.includes(addForm.category)) {
      toast.error('Invalid category selected. Please select a valid category.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', addForm.name);
      formData.append('description', addForm.desc);
      formData.append('price', Number(addForm.price));
      if (addForm.originalPrice) {
        formData.append('originalPrice', Number(addForm.originalPrice));
      }
      formData.append('category', addForm.category);
      formData.append('stock', Number(addForm.stock) || 0);
      
      // Add specs if provided
      if (addForm.specs) {
        const specsArray = addForm.specs.split(',').map(s => s.trim()).filter(s => s);
        formData.append('specs', JSON.stringify(specsArray));
      }

      // Add images
      if (addForm.images && addForm.images.length > 0) {
        addForm.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Product added successfully!');
        setAddForm({ 
          name:'', 
          category: 'laptops', 
          price:'', 
          originalPrice:'',
          stock:'', 
          desc:'',
          images: [],
          specs: ''
        });
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 3000);
        fetchProducts(); // Refresh product list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      category: product.category || 'laptops',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock || '',
      desc: product.description || '',
      badge: product.badge || '',
      specs: product.specs ? product.specs.join(', ') : ''
    });
    setEditModalOpen(true);
  };

  const handleEditChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleEditImageChange = e => {
    const files = Array.from(e.target.files);
    setEditForm(f => ({ ...f, images: files }));
  };

  const handleEditSubmit = async () => {
    if (!editForm.name || !editForm.price || !editForm.category) {
      toast.error('Please fill in all required fields (Name, Price, Category)');
      return;
    }

    const validCategories = ['laptops', 'accessories', 'cctv', 'printers'];
    if (!validCategories.includes(editForm.category)) {
      toast.error('Invalid category selected. Please select a valid category.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.desc);
      formData.append('price', Number(editForm.price));
      if (editForm.originalPrice) {
        formData.append('originalPrice', Number(editForm.originalPrice));
      }
      formData.append('category', editForm.category);
      formData.append('stock', Number(editForm.stock) || 0);
      if (editForm.badge) {
        formData.append('badge', editForm.badge);
      }
      
      if (editForm.specs) {
        const specsArray = editForm.specs.split(',').map(s => s.trim()).filter(s => s);
        formData.append('specs', JSON.stringify(specsArray));
      }

      if (editForm.images && editForm.images.length > 0) {
        editForm.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await api.put(`/products/${editingProduct._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Product updated successfully!');
        setEditModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}/status`, { status });
      if (response.data.success) {
        toast.success('Booking status updated');
        fetchBookings();
      }
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      // Assuming a PUT route for orders exists, or we just notify for now.
      // We didn't create the PUT route in this task, but we can implement the stub.
      // const response = await api.put(`/orders/${id}/status`, { status });
      // if (response.data.success) {
      //   toast.success('Order status updated');
      //   fetchOrders();
      // }
      toast.info('Order status update functionality pending');
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-logo">
          <div className="admin-logo-icon"><i className="fa-solid fa-microchip" /></div>
          <div>
            <div className="al-name">Gateway</div>
            <div className="al-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV.map(n => (
            <button
              key={n.id}
              className={`admin-nav-btn ${page === n.id ? 'admin-nav-btn--active' : ''}`}
              onClick={() => { setPage(n.id); setSidebarOpen(false); }}
            >
              <i className={`fa-solid ${n.icon}`} />
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="admin-nav-btn">
            <i className="fa-solid fa-arrow-left" /> <span>Back to Site</span>
          </a>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button className="admin-menu-btn" onClick={() => setSidebarOpen(v => !v)}>
            <i className="fa-solid fa-bars" />
          </button>
          <h1 className="admin-page-title">
            {NAV.find(n => n.id === page)?.label}
          </h1>
          <div className="admin-topbar-right">
            <button
              className="admin-logout-btn"
              type="button"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
            >
              <i className="fa-solid fa-right-from-bracket" /> Logout
            </button>
            <div className="admin-avatar">
              <i className="fa-solid fa-user-shield" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {page === 'dashboard'       && <Dashboard productList={productList} bookingList={bookingList} orderList={orderList} />}
          {page === 'add-product'     && <AddProduct form={addForm} onChange={handleAddChange} onImageChange={handleImageChange} onSubmit={handleAddSubmit} success={addSuccess} />}
          {page === 'manage-products' && <ManageProducts list={productList} onDelete={deleteProduct} onEdit={openEditModal} />}
          {page === 'bookings'        && <Bookings list={bookingList} onStatusChange={updateBookingStatus} />}
          {page === 'orders'          && <Orders list={orderList} onStatusChange={updateOrderStatus} />}
          {page === 'contacts'        && <Contacts list={contactList} />}
          {page === 'services'        && <Services list={serviceList} />}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editModalOpen && (
        <EditProductModal
          form={editForm}
          onChange={handleEditChange}
          onImageChange={handleEditImageChange}
          onSubmit={handleEditSubmit}
          onClose={() => { setEditModalOpen(false); setEditingProduct(null); }}
          product={editingProduct}
        />
      )}
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({ productList, bookingList, orderList = [] }) {
  const pending   = bookingList.filter(b => b.status === 'pending').length;
  const confirmed = bookingList.filter(b => b.status === 'confirmed').length;
  const done      = bookingList.filter(b => b.status === 'done').length;

  const stats = [
    { icon:'fa-box',            label:'Total Products',    value: productList.length,    color:'orange'  },
    { icon:'fa-calendar-check', label:'Total Bookings',    value: bookingList.length,    color:'blue'    },
    { icon:'fa-shopping-cart',  label:'Total Orders',      value: orderList.length,      color:'green'   },
    { icon:'fa-clock',          label:'Pending Bookings',  value: pending,               color:'yellow'  },
  ];

  return (
    <div className="dashboard">
      <div className="dash-stats">
        {stats.map((s, i) => (
          <div key={i} className={`dash-stat-card dash-stat--${s.color}`}>
            <div className="dsc-icon"><i className={`fa-solid ${s.icon}`} /></div>
            <div className="dsc-val">{s.value}</div>
            <div className="dsc-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="dash-section">
        <h2>Recent Booking Requests</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Service</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.slice(0,5).map(b => (
                <tr key={b.id}>
                  <td><span style={{color:'var(--orange)',fontWeight:600}}>{b.id}</span></td>
                  <td>{b.name}</td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                  <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Products */}
      <div className="dash-section">
        <h2>Product Inventory</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
            </thead>
            <tbody>
              {productList.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td style={{textTransform:'capitalize'}}>{p.category}</td>
                  <td>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>{p.stock} units</td>
                  <td><span className={`status status-${p.status}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Add Product ── */
function AddProduct({ form, onChange, onImageChange, onSubmit, success }) {
  const categories = [
    { id: 'laptops', label: 'Laptops' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'cctv', label: 'CCTV & Security' },
    { id: 'printers', label: 'Printers' },
  ];

  return (
    <div className="admin-form-page">
      <div className="admin-form-card">
        <div className="afc-header">
          <i className="fa-solid fa-circle-plus" />
          <div>
            <h2>Add New Product</h2>
            <p>Fill in the product details below</p>
          </div>
        </div>

        {success && (
          <div className="admin-alert admin-alert--success">
            <i className="fa-solid fa-circle-check" /> Product added successfully!
          </div>
        )}

        <div className="admin-form-grid">
          <div className="form-group span-2">
            <label>Product Name *</label>
            <input name="name" value={form.name} onChange={onChange} className="form-control" placeholder="Enter product name" />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={onChange} className="form-control" required>
              <option value="laptops">Laptops</option>
              <option value="accessories">Accessories</option>
              <option value="cctv">CCTV & Security</option>
              <option value="printers">Printers</option>
            </select>
          </div>

          <div className="form-group">
            <label>Selling Price (₹) *</label>
            <input name="price" value={form.price} onChange={onChange} className="form-control" placeholder="e.g. 4999" type="number" min="0" />
          </div>

          <div className="form-group">
            <label>Original Price / MSRP (₹) (Optional)</label>
            <input name="originalPrice" value={form.originalPrice} onChange={onChange} className="form-control" placeholder="e.g. 5999" type="number" min="0" />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input name="stock" value={form.stock} onChange={onChange} className="form-control" placeholder="Units in stock" type="number" min="0" />
          </div>

          <div className="form-group">
            <label>Product Badge</label>
            <select name="badge" value={form.badge || ''} onChange={onChange} className="form-control">
              <option value="">No Badge</option>
              <option value="New">New</option>
              <option value="Bestseller">Bestseller</option>
              <option value="Popular">Popular</option>
              <option value="Second-hand">Second-hand</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          <div className="form-group span-2">
            <label>Product Images (Upload from System) *</label>
            <input 
              type="file" 
              name="images" 
              onChange={onImageChange} 
              className="form-control" 
              multiple 
              accept="image/jpeg,image/jpg,image/png,image/webp"
            />
            <small style={{color:'var(--text-muted)',fontSize:'12px',marginTop:'4px',display:'block'}}>
              Upload up to 5 images (JPEG, PNG, WebP, max 5MB each)
            </small>
            {form.images && form.images.length > 0 && (
              <div style={{marginTop:'8px',display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {Array.from(form.images).map((img, i) => (
                  <div key={i} style={{width:'60px',height:'60px',borderRadius:'8px',overflow:'hidden',border:'2px solid var(--card-border)'}}>
                    <img src={URL.createObjectURL(img)} alt={`Preview ${i+1}`} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group span-2">
            <label>Specifications (comma-separated)</label>
            <input name="specs" value={form.specs || ''} onChange={onChange} className="form-control" placeholder="e.g. 16GB RAM, 512GB SSD, Intel i5" />
          </div>

          <div className="form-group span-2">
            <label>Description</label>
            <textarea name="desc" value={form.desc} onChange={onChange} className="form-control" rows={4} placeholder="Short product description..." />
          </div>
        </div>

        <div style={{padding:'0 32px 32px', display:'flex', gap:'12px'}}>
          <button className="btn btn-primary btn-lg" onClick={onSubmit}>
            <i className="fa-solid fa-plus" /> Add Product
          </button>
          <button className="btn btn-ghost">Clear Form</button>
        </div>
      </div>
    </div>
  );
}

/* ── Manage Products ── */
function ManageProducts({ list, onDelete, onEdit }) {
  const [search, setSearch] = useState('');
  const filtered = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-table-page">
      <div className="atp-header">
        <h2>{list.length} Products</h2>
        <div className="atp-search">
          <i className="fa-solid fa-search" />
          <input className="form-control" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              // Use Cloudinary URL directly (already full URL)
              const imageUrl = p.images?.[0] || 'https://via.placeholder.com/40';
              
              return (
                <tr key={p._id}>
                  <td>{i + 1}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <img src={imageUrl} alt={p.name} style={{width:'40px',height:'40px',objectFit:'cover',borderRadius:'6px'}} />
                      <span style={{fontWeight:500,color:'white'}}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{textTransform:'capitalize'}}>{p.category}</td>
                  <td style={{color:'var(--orange)',fontWeight:700}}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td>{p.stock} units</td>
                  <td>
                    <span className={`status ${p.isAvailable ? 'status-active' : 'status-outofstock'}`}>
                      {p.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="tbl-actions">
                      <button className="tbl-btn tbl-btn--edit" onClick={() => onEdit(p)}><i className="fa-solid fa-pen" /></button>
                      <button className="tbl-btn tbl-btn--del" onClick={() => onDelete(p._id)}><i className="fa-solid fa-trash" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Bookings ── */
function Bookings({ list, onStatusChange }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? list : list.filter(b => b.status === filter);

  return (
    <div className="admin-table-page">
      <div className="atp-header">
        <h2>{list.length} Booking Requests</h2>
        <div className="booking-filters">
          {['all','pending','confirmed','done'].map(f => (
            <button key={f} className={`cat-tab ${filter===f?'cat-tab--active':''}`}
              onClick={() => setFilter(f)} style={{textTransform:'capitalize'}}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b._id}>
                <td><span style={{color:'var(--orange)',fontWeight:600}}>{b.bookingRef}</span></td>
                <td style={{fontWeight:500,color:'white'}}>{b.name}</td>
                <td>{b.serviceLabel || b.service}</td>
                <td>{new Date(b.preferredDate).toLocaleDateString()}</td>
                <td>
                  <a href={`tel:+91${b.phone}`} style={{color:'var(--orange)'}}>{b.phone}</a>
                </td>
                <td><span className={`status status-${b.status}`}>{b.status}</span></td>
                <td>
                  <div className="tbl-actions">
                    {b.status === 'pending' && (
                      <button className="tbl-btn tbl-btn--confirm" onClick={() => onStatusChange(b._id,'confirmed')}>
                        <i className="fa-solid fa-check" />
                      </button>
                    )}
                    {b.status === 'confirmed' && (
                      <button className="tbl-btn tbl-btn--done" onClick={() => onStatusChange(b._id,'done')}>
                        <i className="fa-solid fa-circle-check" />
                      </button>
                    )}
                    <a href={`tel:+91${b.phone}`} className="tbl-btn tbl-btn--call">
                      <i className="fa-solid fa-phone" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Orders ── */
function Orders({ list, onStatusChange }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? list : list.filter(o => o.orderStatus === filter);

  return (
    <div className="admin-table-page">
      <div className="atp-header">
        <h2>{list.length} Product Orders</h2>
        <div className="booking-filters">
          {['all','new','processing','shipped','delivered'].map(f => (
            <button key={f} className={`cat-tab ${filter===f?'cat-tab--active':''}`}
              onClick={() => setFilter(f)} style={{textTransform:'capitalize'}}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o._id}>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{fontWeight:500,color:'white'}}>{o.customerName}</div>
                  <div style={{fontSize:'13px',color:'var(--orange)',marginTop:'2px'}}>{o.customerPhone}</div>
                  <div style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>{o.customerAddress}</div>
                </td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                    {o.product?.images?.[0] && <img src={o.product.images[0]} alt="" style={{width:'32px',height:'32px',borderRadius:'4px',objectFit:'cover'}} />}
                    <span style={{maxWidth:'150px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.product?.name || 'Deleted Product'}</span>
                  </div>
                </td>
                <td>{o.quantity}</td>
                <td style={{color:'var(--orange)',fontWeight:600}}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status status-${o.orderStatus === 'new' ? 'pending' : o.orderStatus === 'delivered' ? 'done' : 'active'}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td>
                  <div className="tbl-actions">
                    <button className="tbl-btn tbl-btn--edit" onClick={() => toast.info('Order details feature coming soon')}>
                      <i className="fa-solid fa-eye" />
                    </button>
                    <a href={`https://wa.me/91${o.customerPhone}?text=Hi%20${encodeURIComponent(o.customerName)},%20regarding%20your%20order%20for%20${encodeURIComponent(o.product?.name)}...`} target="_blank" rel="noopener noreferrer" className="tbl-btn tbl-btn--call" style={{background: '#25D366'}}>
                      <i className="fa-brands fa-whatsapp" style={{color: 'white'}} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Contacts ── */
function Contacts({ list }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? list : list.filter(c => filter === 'unread' ? !c.isRead : c.isRead);

  return (
    <div className="admin-table-page">
      <div className="atp-header">
        <h2>{list.length} Contact Messages</h2>
        <div className="booking-filters">
          {['all','unread','read'].map(f => (
            <button key={f} className={`cat-tab ${filter===f?'cat-tab--active':''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id}>
                <td style={{fontWeight:500,color:'white'}}>{c.name}</td>
                <td>
                  <a href={`tel:+91${c.phone}`} style={{color:'var(--orange)'}}>{c.phone}</a>
                </td>
                <td style={{maxWidth:'300px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {c.message}
                </td>
                <td style={{textTransform:'capitalize'}}>{c.type || 'general'}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${c.isRead ? 'status-done' : 'status-pending'}`}>
                    {c.isRead ? 'Read' : 'Unread'}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No contacts found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Services ── */
function Services({ list }) {
  return (
    <div className="admin-table-page">
      <div className="atp-header">
        <h2>{list.length} Services</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Icon</th>
              <th>Title</th>
              <th>Price</th>
              <th>Features</th>
              <th>Order</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map(s => (
              <tr key={s._id}>
                <td>
                  <div style={{width:'40px',height:'40px',borderRadius:'8px',background:'rgba(255,107,0,0.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <i className={`fa-solid ${s.icon}`} style={{color:'var(--orange)',fontSize:'18px'}} />
                  </div>
                </td>
                <td style={{fontWeight:500,color:'white'}}>{s.title}</td>
                <td style={{color:'var(--orange)',fontWeight:700}}>{s.startingPrice}</td>
                <td>{s.features?.length || 0} features</td>
                <td>{s.order}</td>
                <td>
                  <span className={`status ${s.isActive ? 'status-active' : 'status-outofstock'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No services found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Edit Product Modal ── */
function EditProductModal({ form, onChange, onImageChange, onSubmit, onClose, product }) {
  const categories = [
    { id: 'laptops', label: 'Laptops' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'cctv', label: 'CCTV & Security' },
    { id: 'printers', label: 'Printers' },
  ];

  return (
    <div className="edit-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="edit-modal-content" style={{
        background: 'var(--card-bg)',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Edit Product</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Update product details</p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}>
            <i className="fa-solid fa-times" />
          </button>
        </div>

        <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div className="form-group span-2">
            <label>Product Name *</label>
            <input name="name" value={form.name} onChange={onChange} className="form-control" placeholder="Enter product name" />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={onChange} className="form-control">
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Selling Price (₹) *</label>
            <input name="price" value={form.price} onChange={onChange} className="form-control" placeholder="e.g. 4999" type="number" min="0" />
          </div>

          <div className="form-group">
            <label>Original Price / MSRP (₹) (Optional)</label>
            <input name="originalPrice" value={form.originalPrice} onChange={onChange} className="form-control" placeholder="e.g. 5999" type="number" min="0" />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input name="stock" value={form.stock} onChange={onChange} className="form-control" placeholder="Units in stock" type="number" min="0" />
          </div>

          <div className="form-group">
            <label>Product Badge</label>
            <select name="badge" value={form.badge || ''} onChange={onChange} className="form-control">
              <option value="">No Badge</option>
              <option value="New">New</option>
              <option value="Bestseller">Bestseller</option>
              <option value="Popular">Popular</option>
              <option value="Second-hand">Second-hand</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          <div className="form-group span-2">
            <label>Product Images (Upload New Images - Optional)</label>
            <input 
              type="file" 
              name="images" 
              onChange={onImageChange} 
              className="form-control" 
              multiple 
              accept="image/jpeg,image/jpg,image/png,image/webp"
            />
            <small style={{color:'var(--text-muted)',fontSize:'12px',marginTop:'4px',display:'block'}}>
              Upload new images to replace existing ones (JPEG, PNG, WebP, max 5MB each)
            </small>
            {product?.images?.length > 0 && (
              <div style={{marginTop:'12px'}}>
                <p style={{fontSize:'13px',color:'var(--text-muted)',marginBottom:'8px'}}>Current Images:</p>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  {product.images.map((img, i) => (
                    <div key={i} style={{width:'80px',height:'80px',borderRadius:'8px',overflow:'hidden',border:'2px solid var(--card-border)'}}>
                      <img src={img} alt={`Current ${i+1}`} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group span-2">
            <label>Specifications (comma-separated)</label>
            <input name="specs" value={form.specs || ''} onChange={onChange} className="form-control" placeholder="e.g. 16GB RAM, 512GB SSD, Intel i5" />
          </div>

          <div className="form-group span-2">
            <label>Description</label>
            <textarea name="desc" value={form.desc} onChange={onChange} className="form-control" rows={4} placeholder="Short product description..." />
          </div>
        </div>

        <div style={{marginTop:'24px', display:'flex', gap:'12px'}}>
          <button className="btn btn-primary btn-lg" onClick={onSubmit}>
            <i className="fa-solid fa-save" /> Update Product
          </button>
          <button className="btn btn-ghost btn-lg" onClick={onClose}>
            <i className="fa-solid fa-times" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

